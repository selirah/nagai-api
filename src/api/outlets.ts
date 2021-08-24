import { router } from '../utils'
import { Request, Response } from 'express'
import { Outlet } from '../entities/Outlet'
import { authorization } from '../middleware/auth'
import { getConnection } from 'typeorm'
import { validateClient } from '../validations'
import { __Outlet__ } from '../models/__Outlet__'

router.post('/outlets', authorization, async (req: Request, res: Response) => {
  const inputs: __Outlet__ = req.body
  const errors = validateClient(inputs)

  if (errors) {
    return res.status(400).json({ errors })
  }

  let client: __Outlet__
  const queryResult = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Outlet)
    .values({
      // businessName: inputs.businessName,
      // businessEmail: inputs.businessEmail,
      // phoneNumber: inputs.phoneNumber,
      // coordinates: inputs.coordinates,
      // territoryId: inputs.territoryId,
      // location: inputs.location,
      // logo: inputs.logo
    })
    .returning('*')
    .execute()

  client = queryResult.raw[0]
  if (!client) {
    return res.sendStatus(500)
  }

  return res.status(201).json(client)
})

router.put(
  '/outlets/:id',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Outlet__ = req.body
    const errors = validateClient(inputs)
    const id: number = parseInt(req.params.id)

    if (errors) {
      return res.status(400).json({ errors })
    }

    const queryResult = await getConnection()
      .createQueryBuilder()
      .update(Outlet)
      .set({
        // businessName: inputs.businessName,
        // businessEmail: inputs.businessEmail,
        // phoneNumber: inputs.phoneNumber,
        // coordinates: inputs.coordinates,
        // territoryId: inputs.territoryId,
        // location: inputs.location,
        // logo: inputs.logo
      })
      .where('"id" = :id', {
        id: id
      })
      .execute()

    if (queryResult.affected !== 1) {
      return res.sendStatus(500)
    }
    const client = await getConnection()
      .getRepository(Outlet)
      .createQueryBuilder('client')
      .where('"id" = :id', {
        id: id
      })
      .getOne()

    if (!client) {
      return res.sendStatus(500)
    }

    return res.status(200).json(client)
  }
)

router.get('/outlets', async (_: Request, res: Response) => {
  const clients = await getConnection()
    .getRepository(Outlet)
    .createQueryBuilder('clients')
    .orderBy('clients."createdAt"', 'DESC')
    .getMany()

  return res.status(200).json(clients)
})

router.delete(
  '/outlets/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id)

    const queryResult = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Outlet)
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

export { router as clients }
