import { router } from '../utils'
import { Request, Response } from 'express'
import { Stock } from '../entities/Stock'
import { StockTrail } from '../entities/StockTrail'
import { authorization } from '../middleware/auth'
import { Brackets, getConnection } from 'typeorm'
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
        reorderDate: new Date(inputs.reorderDate),
        comments: inputs.comments
      })
      .returning('*')
      .execute()
    stock = queryResult.raw[0]
    if (!stock) {
      return res.sendStatus(500)
    }
    try {
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
        reorderDate: new Date(inputs.reorderDate),
        user: req.user
      }).save()
    } catch (err) {
      console.log(err)
    }
  } catch (err) {
    console.log(err)
    const errors = productExists(inputs, err)
    if (errors) {
      return res.status(400).json({ errors })
    }
  }

  return res.sendStatus(201)
})

router.put('/stock/:id', authorization, async (req: Request, res: Response) => {
  const inputs: __Stock__ = req.body
  const errors = validateStock(inputs)
  const id: string = req.params.id

  if (errors) {
    return res.status(400).json({ errors })
  }

  let stock: __Stock__ | undefined

  try {
    const queryResult = await getConnection()
      .createQueryBuilder()
      .update(Stock)
      .set({
        unit: inputs.unit,
        unitPrice: inputs.unitPrice,
        quantityPurchased: inputs.quantityPurchased,
        quantityInStock: () =>
          `"quantityInStock" + ${inputs.quantityPurchased}`,
        stockValue: () =>
          `"stockValue" + ${inputs.unitPrice * inputs.quantityPurchased}`,
        reorderLevel: inputs.reorderLevel,
        reorderQuantity: inputs.reorderQuantity,
        reorderDate: new Date(inputs.reorderDate),
        comments: inputs.comments
      })
      .where('"id" = :id', {
        id: id
      })
      .returning('*')
      .execute()

    stock = queryResult.raw[0]
    if (!stock) {
      return res.sendStatus(500)
    }
    try {
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
        reorderDate: new Date(inputs.reorderDate),
        user: req.user
      }).save()
    } catch (err) {
      console.log(err)
    }
  } catch (err) {
    console.log(err)
  }

  return res.sendStatus(200)
})

router.get('/stock', authorization, async (req: Request, res: Response) => {
  const page = req.query.page !== undefined ? +req.query.page : 10
  const skip = req.query.skip !== undefined ? +req.query.skip : 0
  const query = req.query.query
  const fromDate = req.query.fromDate
  const toDate = req.query.toDate

  if (!isEmpty(fromDate) && !isEmpty(toDate)) {
    const [stock, count] = await getConnection()
      .getRepository(Stock)
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.product', 'product')
      .where(`stock.createdAt BETWEEN '${fromDate}' AND '${toDate}'`)
      .andWhere(
        new Brackets((sqb) => {
          sqb.where('stock."productId" like :query', {
            query: `%${query?.toString().toUpperCase()}%`
          })
          sqb.orWhere('stock."sku" like :query', {
            query: `%${query}%`
          })
        })
      )
      .skip(skip)
      .take(page)
      .getManyAndCount()
    return res.status(200).json({ stock, count })
  } else {
    const [stock, count] = await getConnection()
      .getRepository(Stock)
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.product', 'product')
      .where('stock."productId" like :query', {
        query: `%${query?.toString().toUpperCase()}%`
      })
      .orWhere('stock."sku" like :query', {
        query: `%${query}%`
      })
      .skip(skip)
      .take(page)
      .getManyAndCount()
    return res.status(200).json({ stock, count })
  }
})

router.get(
  '/stock/:productId',
  authorization,
  async (req: Request, res: Response) => {
    const productId: string = req.params.productId
    let stock: Stock[] = []
    try {
      stock = await getConnection()
        .getRepository(Stock)
        .createQueryBuilder('stock')
        .where('"productId" = :id', {
          id: productId
        })
        .getMany()
      return res.status(200).json(stock)
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
  }
)

router.delete(
  '/stock/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: string = req.params.id

    try {
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
    } catch (err) {
      console.log(err)
    }
    return res.sendStatus(200)
  }
)

export { router as stock }
