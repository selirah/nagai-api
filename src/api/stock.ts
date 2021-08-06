import { router } from '../utils'
import { Request, Response } from 'express'
import { Stock } from '../entities/Stock'
import { StockTrail } from '../entities/StockTrail'
import { authorization } from '../middleware/auth'
import { getConnection } from 'typeorm'
import { validateStock, productExists } from '../validations'
import { __Stock__ } from '../models/__Stock__'
import { __User__ } from '../models/__User__'
import { generateRandomNumbers } from '../helper/functions'
import { isEmpty } from '../validations/isEmpty'

router.post('/stock', authorization, async (req: Request, res: Response) => {
  const inputs: __Stock__ = req.body
  const errors = validateStock(inputs)

  if (errors) {
    return res.status(400).json({ errors })
  }

  let stock: __Stock__ | undefined
  try {
    const queryResult = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Stock)
      .values({
        id: `STK${generateRandomNumbers()}`,
        productId: inputs.productId,
        sku: inputs.sku,
        unit: inputs.unit,
        unitPrice: inputs.unitPrice,
        quantityPurchased: inputs.quantityPurchased,
        quantityInStock: inputs.quantityPurchased, //since this is new entry
        stockValue: inputs.unitPrice * inputs.quantityPurchased,
        reorderLevel: inputs.reorderLevel,
        reorderQuantity: inputs.reorderQuantity,
        reorderDate: inputs.reorderDate,
        comments: inputs.comments
      })
      .returning('*')
      .execute()

    stock = queryResult.raw[0]
    if (!stock) {
      return res.sendStatus(500)
    }
    // save stock trail
    await StockTrail.create({
      stockId: stock.id,
      productId: inputs.productId,
      sku: inputs.sku,
      unit: inputs.unit,
      unitPrice: inputs.unitPrice,
      quantityPurchased: inputs.quantityPurchased,
      amount: inputs.unitPrice * inputs.quantityPurchased,
      quantityInStock: stock.quantityInStock,
      stockValue: stock.stockValue,
      reorderLevel: inputs.reorderLevel,
      reorderQuantity: inputs.reorderQuantity,
      reorderDate: inputs.reorderDate,
      user: req.user
    }).save()
  } catch (err) {
    const errors = productExists(inputs, err)
    if (errors) {
      return res.status(400).json({ errors })
    }
  }
  return res.status(201).json(stock)
})

router.put('/stock/:id', authorization, async (req: Request, res: Response) => {
  const inputs: __Stock__ = req.body
  const errors = validateStock(inputs)
  const id: string = req.params.id

  if (errors) {
    return res.status(400).json({ errors })
  }

  let stock: __Stock__ | undefined

  const queryResult = await getConnection()
    .createQueryBuilder()
    .update(Stock)
    .set({
      unit: inputs.unit,
      unitPrice: inputs.unitPrice,
      quantityPurchased: inputs.quantityPurchased,
      quantityInStock: () => `"quantityInStock" + ${inputs.quantityPurchased}`,
      stockValue: () => `"quantityInStock" * ${inputs.unitPrice}`,
      reorderLevel: inputs.reorderLevel,
      reorderQuantity: inputs.reorderQuantity,
      reorderDate: inputs.reorderDate,
      comments: inputs.comments
    })
    .where('"id" = :id', {
      id: id
    })
    .returning('*')
    .execute()

  // if (queryResult.affected !== 1) {
  //   return res.sendStatus(500)
  // }
  stock = queryResult.raw[0]
  if (!stock) {
    return res.sendStatus(500)
  }

  await StockTrail.create({
    stockId: id,
    productId: inputs.productId,
    sku: inputs.sku,
    unit: inputs.unit,
    unitPrice: inputs.unitPrice,
    quantityPurchased: inputs.quantityPurchased,
    amount: inputs.unitPrice * inputs.quantityPurchased,
    quantityInStock: stock.quantityInStock,
    stockValue: stock.stockValue,
    reorderLevel: inputs.reorderLevel,
    reorderQuantity: inputs.reorderQuantity,
    reorderDate: inputs.reorderDate,
    user: req.user
  }).save()

  // const inventory = await getConnection()
  //   .getRepository(Inventory)
  //   .createQueryBuilder('inventory')
  //   .where('"id" = :id', {
  //     id: id
  //   })
  //   .getOne()

  // if (!inventory) {
  //   return res.sendStatus(500)
  // }

  return res.status(200).json(stock)
})

router.get('/stock', authorization, async (req: Request, res: Response) => {
  const page = req.query.page !== undefined ? +req.query.page : 100
  const skip = req.query.skip !== undefined ? +req.query.skip : 0
  const productId = req.query.productId
  const sku = req.query.sku
  const fromDate = req.query.fromDate
  const toDate = req.query.toDate

  if (!isEmpty(productId) && !isEmpty(fromDate)) {
    const [stock, count] = await getConnection()
      .getRepository(Stock)
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.product', 'product')
      .leftJoinAndSelect('stock.stockTrails', 'trails')
      .where('"productId" = :product_id', {
        product_id: productId
      })
      .andWhere(`stock.createdAt BETWEEN '${fromDate}' AND '${toDate}'`)
      .skip(skip)
      .take(page)
      .getManyAndCount()
    return res.status(200).json({ stock, count })
  } else if (!isEmpty(sku) && !isEmpty(fromDate)) {
    const [stock, count] = await getConnection()
      .getRepository(Stock)
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.product', 'product')
      .leftJoinAndSelect('stock.stockTrails', 'trails')
      .where('"sku" = :sku', {
        sku: sku
      })
      .andWhere(`stock.createdAt BETWEEN '${fromDate}' AND '${toDate}'`)
      .skip(skip)
      .take(page)
      .getManyAndCount()
    return res.status(200).json({ stock, count })
  } else if (isEmpty(sku) && isEmpty(productId) && !isEmpty(fromDate)) {
    const [stock, count] = await getConnection()
      .getRepository(Stock)
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.product', 'product')
      .leftJoinAndSelect('stock.stockTrails', 'trails')
      .where(`stock.createdAt BETWEEN '${fromDate}' AND '${toDate}'`)
      .skip(skip)
      .take(page)
      .getManyAndCount()
    return res.status(200).json({ stock, count })
  } else if (!isEmpty(productId) && isEmpty(fromDate)) {
    const [stock, count] = await getConnection()
      .getRepository(Stock)
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.product', 'product')
      .leftJoinAndSelect('stock.stockTrails', 'trails')
      .where('"productId" = :product_id', {
        product_id: productId
      })
      .skip(skip)
      .take(page)
      .getManyAndCount()
    return res.status(200).json({ stock, count })
  } else if (!isEmpty(sku) && isEmpty(fromDate)) {
    const [stock, count] = await getConnection()
      .getRepository(Stock)
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.product', 'product')
      .leftJoinAndSelect('stock.stockTrails', 'trails')
      .where('"sku" = :sku', {
        sku: sku
      })
      .skip(skip)
      .take(page)
      .getManyAndCount()
    return res.status(200).json({ stock, count })
  } else {
    const [stock, count] = await getConnection()
      .getRepository(Stock)
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.product', 'product')
      .leftJoinAndSelect('stock.stockTrails', 'trails')
      .skip(skip)
      .take(page)
      .getManyAndCount()
    return res.status(200).json({ stock, count })
  }
})

router.delete(
  '/stock/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: string = req.params.id

    const queryResult = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Stock)
      .where('"id" = :id', {
        id: id
      })
      .execute()

    if (queryResult.affected !== 1) {
      return res.sendStatus(500)
    }
    return res.sendStatus(204)
  }
)

export { router as stock }
