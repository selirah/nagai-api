import { router } from '../utils'
import { Request, Response } from 'express'
import { UserTerritory } from '../entities/UserTerritory'
// import { User } from '../entities/User'
import { authorization } from '../middleware/auth'
import { getConnection } from 'typeorm'
import { validateUserTerritory, userTerritoryExist } from '../validations'
import { __UserTerritory__ } from '../models/__UserTerritory__'

router.post(
  '/user-territories',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __UserTerritory__ = req.body
    const errors = validateUserTerritory(inputs)

    if (errors) {
      return res.status(400).json({ errors })
    }

    let userTerritory: __UserTerritory__
    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(UserTerritory)
        .values({
          userId: inputs.userId,
          territories: inputs.territories
        })
        .returning('*')
        .execute()

      userTerritory = queryResult.raw[0]
      if (!userTerritory) {
        return res.sendStatus(500)
      }
    } catch (err) {
      const errors = userTerritoryExist(err)
      if (errors) {
        return res.status(400).json({ errors })
      }
    }
    return res.sendStatus(201)
  }
)

router.put(
  '/user-territories/:id',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __UserTerritory__ = req.body
    const errors = validateUserTerritory(inputs)
    const id: number = parseInt(req.params.id)

    if (errors) {
      return res.status(400).json({ errors })
    }

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .update(UserTerritory)
        .set({
          userId: inputs.userId,
          territories: inputs.territories
        })
        .where('id = :id', {
          id: id
        })
        .execute()

      if (queryResult.affected !== 1) {
        return res.sendStatus(500)
      }
      return res.sendStatus(200)
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
  }
)

router.get('/user-territories', async (req: Request, res: Response) => {
  const page = req.query.page !== undefined ? +req.query.page : 10
  const skip = req.query.skip !== undefined ? +req.query.skip : 0

  try {
    const [userTerritories, count] = await getConnection()
      .getRepository(UserTerritory)
      .createQueryBuilder('userTerritories')
      .leftJoinAndSelect('userTerritories.user', 'user')
      .skip(skip)
      .take(page)
      .getManyAndCount()
    return res.status(200).json({ userTerritories, count })
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

router.get('/user-territories/:userId', async (req: Request, res: Response) => {
  const userId: number = parseInt(req.params.userId)
  try {
    const userTerritories = await getConnection()
      .getRepository(UserTerritory)
      .createQueryBuilder('userTerritories')
      .leftJoinAndSelect('userTerritories.user', 'user')
      .where('outlets."userId" = :user_id', {
        user_id: userId
      })
      .getOneOrFail()
    return res.status(200).json(userTerritories)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

router.delete(
  '/user-territories/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id)
    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .delete()
        .from(UserTerritory)
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

export { router as userTerritories }
