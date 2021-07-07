import { router } from 'utils'
import { Request, Response } from 'express'
import { Client } from 'entities/Client'
import { authorization } from 'middleware/auth'
import { getConnection } from 'typeorm'
import { validateClient } from 'validations'
import { __Client__ } from 'models/__Client__'

router.post('/clients', authorization, async (req: Request, res: Response) => {
  const inputs: __Client__ = req.body
  const errors = validateClient(inputs)

  if (errors) {
    return res.status(400).json({ errors })
  }

  let client: __Client__
  const queryResult = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Client)
    .values({
      businessName: inputs.businessName,
      businessEmail: inputs.businessEmail,
      phoneNumber: inputs.phoneNumber,
      coordinates: inputs.coordinates,
      cityId: inputs.cityId,
      territoryId: inputs.territoryId,
      location: inputs.location,
      logo: inputs.logo
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
  '/clients/:id',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Client__ = req.body
    const errors = validateClient(inputs)
    const clientId: number = parseInt(req.params.id)

    if (errors) {
      return res.status(400).json({ errors })
    }

    const queryResult = await getConnection()
      .createQueryBuilder()
      .update(Client)
      .set({
        businessName: inputs.businessName,
        businessEmail: inputs.businessEmail,
        phoneNumber: inputs.phoneNumber,
        coordinates: inputs.coordinates,
        cityId: inputs.cityId,
        territoryId: inputs.territoryId,
        location: inputs.location,
        logo: inputs.logo
      })
      .where('"clientId" = :clientId', {
        clientId: clientId
      })
      .execute()

    if (queryResult.affected !== 1) {
      return res.sendStatus(500)
    }
    const client = await getConnection()
      .getRepository(Client)
      .createQueryBuilder('client')
      .where('"clientId" = :clientId', {
        clientId: clientId
      })
      .getOne()

    if (!client) {
      return res.sendStatus(500)
    }

    return res.status(200).json(client)
  }
)

router.get('/clients', async (_: Request, res: Response) => {
  const clients = await getConnection()
    .getRepository(Client)
    .createQueryBuilder('clients')
    .orderBy('clients."createdAt"', 'DESC')
    .getMany()

  return res.status(200).json(clients)
})

router.delete(
  '/clients/:id',
  authorization,
  async (req: Request, res: Response) => {
    const clientId: number = parseInt(req.params.id)

    const queryResult = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Client)
      .where('"clientId" = :clientId', {
        clientId: clientId
      })
      .execute()

    if (queryResult.affected !== 1) {
      return res.sendStatus(500)
    }
    return res.sendStatus(204)
  }
)

export { router as clients }
