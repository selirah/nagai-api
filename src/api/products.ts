import { router } from '../utils'
import { Request, Response } from 'express'
import { Product } from '../entities/Product'
import { authorization } from '../middleware/auth'
import { getConnection } from 'typeorm'
import { validateProduct } from '../validations'
import { __Product__ } from '../models/__Product__'
import { generateRandomNumbers } from '../helper/functions'

router.post('/products', authorization, async (req: Request, res: Response) => {
  const inputs: __Product__ = req.body
  const errors = validateProduct(inputs)

  if (errors) {
    return res.status(400).json({ errors })
  }

  const findOne = await Product.findOne({
    where: {
      productName: inputs.productName.toLowerCase(),
      categoryId: inputs.categoryId
    }
  })

  if (findOne) {
    const errors = [
      {
        field: 'productName',
        message: `Product ${inputs.productName.toUpperCase()} already exists`
      }
    ]
    return res.status(400).json({ errors })
  }

  let product: __Product__
  const queryResult = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Product)
    .values({
      id: `${inputs.productName
        .substring(0, 3)
        .toUpperCase()}${generateRandomNumbers()}`,
      productName: inputs.productName.toLowerCase(),
      categoryId: inputs.categoryId,
      manufacturerId: inputs.manufacturerId
    })
    .returning('*')
    .execute()

  product = queryResult.raw[0]
  if (!product) {
    return res.sendStatus(500)
  }

  return res.status(201).json(product)
})

router.put(
  '/products/:id',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Product__ = req.body
    const errors = validateProduct(inputs)
    const id: string = req.params.id

    if (errors) {
      return res.status(400).json({ errors })
    }

    const queryResult = await getConnection()
      .createQueryBuilder()
      .update(Product)
      .set({
        productName: inputs.productName,
        categoryId: inputs.categoryId,
        manufacturerId: inputs.manufacturerId
      })
      .where('"id" = :id', {
        id: id
      })
      .execute()

    if (queryResult.affected !== 1) {
      return res.sendStatus(500)
    }
    const product = await getConnection()
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('"id" = :id', {
        id: id
      })
      .getOne()

    if (!product) {
      return res.sendStatus(500)
    }

    return res.status(200).json(product)
  }
)

router.get('/products', authorization, async (req: Request, res: Response) => {
  const limit = req.query.limit !== undefined ? +req.query.limit : 100
  const offset = req.query.offset !== undefined ? +req.query.offset : 0

  const products = await getConnection()
    .getRepository(Product)
    .createQueryBuilder('products')
    // .leftJoinAndSelect('products.inventory', 'inventory')
    .skip(offset)
    .take(limit)
    .getMany()

  return res.status(200).json(products)
})

router.delete(
  '/products/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id)

    const queryResult = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Product)
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

export { router as products }
