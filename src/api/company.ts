import { router } from '../utils'
import { Request, Response } from 'express'
import { Company } from '../entities/Company'
import { authorization } from '../middleware/auth'
import { getConnection } from 'typeorm'
import { validateCompany } from '../validations'
import { __Company__ } from '../models/__Company__'

router.post('/company', authorization, async (req: Request, res: Response) => {
  const inputs: __Company__ = req.body
  const errors = validateCompany(inputs)

  if (errors) {
    return res.status(400).json({ errors })
  }
  let company: __Company__
  const queryResult = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Company)
    .values({
      name: inputs.name,
      email: inputs.email,
      phone: inputs.phone,
      coordinates: inputs.coordinates,
      logo: inputs.logo
    })
    .returning('*')
    .execute()
  company = queryResult.raw[0]

  if (!company) {
    return res.sendStatus(500)
  }

  return res.status(201).json(company)
})

router.put(
  '/company/:id',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Company__ = req.body
    const errors = validateCompany(inputs)
    const companyId: number = parseInt(req.params.id)

    if (errors) {
      return res.status(400).json({ errors })
    }

    const queryResult = await getConnection()
      .createQueryBuilder()
      .update(Company)
      .set({
        name: inputs.name,
        email: inputs.email,
        phone: inputs.phone,
        coordinates: inputs.coordinates,
        logo: inputs.logo
      })
      .where('id = :id', { id: companyId })
      .execute()

    if (queryResult.affected !== 1) {
      return res.sendStatus(500)
    }
    const company = await getConnection()
      .getRepository(Company)
      .createQueryBuilder('company')
      .where('id = :id', { id: companyId })
      .getOne()

    if (!company) {
      return res.sendStatus(500)
    }

    return res.status(200).json(company)
  }
)

router.get('/company', authorization, async (_: Request, res: Response) => {
  const company = await getConnection()
    .getRepository(Company)
    .createQueryBuilder('company')
    .getOne()

  return res.status(200).json(company)
})

router.delete(
  '/company/:id',
  authorization,
  async (req: Request, res: Response) => {
    const companyId: number = parseInt(req.params.id)

    const queryResult = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Company)
      .where('id = :id', { id: companyId })
      .execute()

    if (queryResult.affected !== 1) {
      return res.sendStatus(500)
    }
    return res.sendStatus(204)
  }
)

export { router as company }
