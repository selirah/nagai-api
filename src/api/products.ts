import { router } from '../utils'
import { Request, Response } from 'express'
import { Product } from '../entities/Product'
import { authorization } from '../middleware/auth'
import { getConnection, Brackets } from 'typeorm'
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
      manufacturerId: inputs.manufacturerId
    }
  })

  if (findOne) {
    const errors = [
      {
        field: 'productName',
        message: `Product ${inputs.productName.toUpperCase()} already exists for this manufacturer`
      }
    ]
    return res.status(400).json({ errors })
  }

  let product: __Product__ | undefined
  const productId = `${inputs.productName
    .substring(0, 3)
    .toUpperCase()}${generateRandomNumbers()}`

  try {
    const queryResult = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values({
        id: productId,
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
  } catch (err) {
    console.log(err)
  }

  return res.sendStatus(201)
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

    try {
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
    } catch (err) {
      console.log(err)
    }

    return res.sendStatus(200)
  }
)

router.get('/products', authorization, async (req: Request, res: Response) => {
  const page = req.query.page !== undefined ? +req.query.page : 100
  const skip = req.query.skip !== undefined ? +req.query.skip : 0
  const category = req.query.category !== undefined ? +req.query.category : 0
  const manufacturer =
    req.query.manufacturer !== undefined ? +req.query.manufacturer : 0
  const query = req.query.query

  if (category !== 0 && manufacturer === 0) {
    const [products, count] = await getConnection()
      .getRepository(Product)
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.stock', 'stock')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.manufacturer', 'manufacturer')
      .where('"categoryId" = :category_id', {
        category_id: category
      })
      .andWhere(
        new Brackets((sqb) => {
          sqb.where('products."id" like :query', {
            query: `%${query?.toString().toUpperCase()}%`
          })
          sqb.orWhere('products."productName" like :query', {
            query: `%${query?.toString().toLowerCase()}%`
          })
        })
      )
      .skip(skip)
      .take(page)
      .getManyAndCount()
    return res.status(200).json({ products, count })
  } else if (category === 0 && manufacturer !== 0) {
    const [products, count] = await getConnection()
      .getRepository(Product)
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.stock', 'stock')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.manufacturer', 'manufacturer')
      .where('"manufacturerId" = :manufacturer_id', {
        manufacturer_id: manufacturer
      })
      .andWhere(
        new Brackets((sqb) => {
          sqb.where('products."id" like :query', {
            query: `%${query?.toString().toUpperCase()}%`
          })
          sqb.orWhere('products."productName" like :query', {
            query: `%${query?.toString().toLowerCase()}%`
          })
        })
      )
      .skip(skip)
      .take(page)
      .getManyAndCount()
    return res.status(200).json({ products, count })
  } else {
    const [products, count] = await getConnection()
      .getRepository(Product)
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.stock', 'stock')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.manufacturer', 'manufacturer')
      .where('products."id" like :query', {
        query: `%${query?.toString().toUpperCase()}%`
      })
      .orWhere('products."productName" like :query', {
        query: `%${query}%`
      })
      .skip(skip)
      .take(page)
      .getManyAndCount()
    return res.status(200).json({ products, count })
  }
})

router.delete(
  '/products/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: string = req.params.id

    try {
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
    } catch (err) {
      console.log(err)
    }
    return res.sendStatus(200)
  }
)

router.get(
  '/products/search',
  authorization,
  async (req: Request, res: Response) => {
    const query = req.query.q
    let products: Product[] = []
    try {
      products = await getConnection()
        .getRepository(Product)
        .createQueryBuilder('products')
        .leftJoinAndSelect('products.stock', 'stock')
        .where('"productId" like :query', {
          query: `%${query?.toString().toUpperCase()}%`
        })
        .orWhere('"productName" like :query', {
          query: `%${query?.toString().toLowerCase()}%`
        })
        .getMany()
    } catch (err: any) {
      console.log(err)
    }

    return res.status(200).json(products)
  }
)

export { router as products }
