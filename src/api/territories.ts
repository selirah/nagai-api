import { router } from '../utils'
import { Request, Response } from 'express'
import { Territory } from '../entities/Territory'
import { authorization } from '../middleware/auth'
import { getConnection } from 'typeorm'
import { validateTerritory } from '../validations'
import { __Territory__ } from '../models/__Territory__'

router.post(
  '/territories',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Territory__ = req.body
    const errors = validateTerritory(inputs)

    if (errors) {
      return res.status(400).json({ errors })
    }

    let territory: __Territory__
    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Territory)
        .values({
          locality: inputs.locality.toLowerCase(),
          coordinates: inputs.coordinates,
          regionId: inputs.regionId,
          description: inputs.description
        })
        .returning('*')
        .execute()

      territory = queryResult.raw[0]
      if (!territory) {
        return res.sendStatus(500)
      }
    } catch (err) {
      console.log(err)
    }

    return res.sendStatus(201)
  }
)

router.put(
  '/territories/:id',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Territory__ = req.body
    const errors = validateTerritory(inputs)
    const id: number = parseInt(req.params.id)

    if (errors) {
      return res.status(400).json({ errors })
    }

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .update(Territory)
        .set({
          locality: inputs.locality.toLowerCase(),
          coordinates: inputs.coordinates,
          regionId: inputs.regionId,
          description: inputs.description
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

router.get('/territories', async (req: Request, res: Response) => {
  const page = req.query.page !== undefined ? +req.query.page : 100
  const skip = req.query.skip !== undefined ? +req.query.skip : 0
  const region = req.query.region !== undefined ? +req.query.region : 0
  const query = req.query.query

  try {
    if (region !== 0) {
      const [territories, count] = await getConnection()
        .getRepository(Territory)
        .createQueryBuilder('territories')
        .leftJoinAndSelect('territories.outlets', 'outlets')
        .leftJoinAndSelect('territories.users', 'users')
        .leftJoinAndSelect('territories.region', 'region')
        .where('territories."regionId" = :region_id', {
          region_id: region
        })
        .andWhere('territories."locality" like :query', {
          query: `%${query?.toString().toLowerCase()}%`
        })
        .skip(skip)
        .take(page)
        .getManyAndCount()
      return res.status(200).json({ territories, count })
    } else {
      const [territories, count] = await getConnection()
        .getRepository(Territory)
        .createQueryBuilder('territories')
        .leftJoinAndSelect('territories.outlets', 'outlets')
        .leftJoinAndSelect('territories.users', 'users')
        .leftJoinAndSelect('territories.region', 'region')
        .where('territories."locality" like :query', {
          query: `%${query?.toString().toLowerCase()}%`
        })
        .skip(skip)
        .take(page)
        .getManyAndCount()
      return res.status(200).json({ territories, count })
    }
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

router.delete(
  '/territories/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id)

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Territory)
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
  '/territories/search',
  authorization,
  async (req: Request, res: Response) => {
    const query = req.query.q
    let territories: Territory[] = []
    try {
      territories = await getConnection()
        .getRepository(Territory)
        .createQueryBuilder('territories')
        .leftJoinAndSelect('territories.region', 'region')
        .where('"locality" like :query', {
          query: `%${query?.toString().toLowerCase()}%`
        })
        .getMany()
      return res.status(200).json(territories)
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
  }
)

export { router as territories }
