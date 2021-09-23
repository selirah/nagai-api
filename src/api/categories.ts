import { router } from '../utils'
import { Request, Response } from 'express'
import { Category } from '../entities/Category'
import { authorization } from '../middleware/auth'
import { getConnection } from 'typeorm'
import { validateCategory } from '../validations'
import { __Category__ } from '../models/__Category__'

router.post(
  '/categories',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Category__ = req.body
    const errors = validateCategory(inputs)

    if (errors) {
      return res.status(400).json({ errors })
    }

    const findOne = await Category.findOne({
      where: {
        category: inputs.category.toLowerCase()
      }
    })

    if (findOne) {
      const errors = [
        {
          field: 'category',
          message: `Category ${inputs.category.toUpperCase()} already exists`
        }
      ]
      return res.status(400).json({ errors })
    }
    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Category)
        .values({
          category: inputs.category.toLowerCase()
        })
        .returning('*')
        .execute()

      if (!queryResult.raw[0]) {
        return res.sendStatus(500)
      }
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }

    return res.sendStatus(201)
  }
)

router.put(
  '/categories/:id',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Category__ = req.body
    const errors = validateCategory(inputs)
    const id: number = parseInt(req.params.id)

    if (errors) {
      return res.status(400).json({ errors })
    }

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .update(Category)
        .set({
          category: inputs.category
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
      return res.sendStatus(500)
    }

    return res.sendStatus(200)
  }
)

router.get('/categories', authorization, async (_: Request, res: Response) => {
  const categories = await getConnection()
    .getRepository(Category)
    .createQueryBuilder('categories')
    .leftJoinAndSelect('categories.products', 'product')
    .orderBy('categories."createdAt"', 'DESC')
    .getMany()

  return res.status(200).json(categories)
})

router.delete(
  '/categories/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id)

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Category)
        .where('id = :id', {
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

router.post(
  '/categories/bulk',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Category__[] = req.body
    try {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Category)
        .values(inputs)
        .execute()

      return res.sendStatus(201)
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
  }
)

export { router as categories }
