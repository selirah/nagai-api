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
    const queryResult = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Territory)
      .values({
        territoryName: inputs.territoryName,
        coordinates: inputs.coordinates
      })
      .returning('*')
      .execute()

    territory = queryResult.raw[0]
    if (!territory) {
      return res.sendStatus(500)
    }

    return res.status(201).json(territory)
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

    const queryResult = await getConnection()
      .createQueryBuilder()
      .update(Territory)
      .set({
        territoryName: inputs.territoryName,
        coordinates: inputs.coordinates
      })
      .where('"id" = :id', {
        id: id
      })
      .execute()

    if (queryResult.affected !== 1) {
      return res.sendStatus(500)
    }
    const territory = await getConnection()
      .getRepository(Territory)
      .createQueryBuilder('territory')
      .where('"id" = :id', {
        id: id
      })
      .getOne()

    if (!territory) {
      return res.sendStatus(500)
    }

    return res.status(200).json(territory)
  }
)

router.get('/territories', async (_: Request, res: Response) => {
  const territories = await getConnection()
    .getRepository(Territory)
    .createQueryBuilder('territories')
    .leftJoinAndSelect('territories.clients', 'clients')
    .orderBy('territories."createdAt"', 'DESC')
    .getMany()

  return res.status(200).json(territories)
})

router.delete(
  '/territories/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id)

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
    return res.sendStatus(204)
  }
)

export { router as territories }
