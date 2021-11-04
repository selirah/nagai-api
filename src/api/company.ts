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
  try {
    const queryResult = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Company)
      .values({
        name: inputs.name,
        email: inputs.email,
        phone: inputs.phone,
        smsID: inputs.smsID,
        logo: inputs.logo
      })
      .returning('*')
      .execute()

    if (!queryResult.raw[0]) {
      return res.sendStatus(500)
    }
    return res.sendStatus(201)
  } catch (err) {
    return res.sendStatus(500)
  }
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

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .update(Company)
        .set({
          name: inputs.name,
          email: inputs.email,
          phone: inputs.phone,
          smsID: inputs.smsID,
          logo: inputs.logo
        })
        .where('id = :id', { id: companyId })
        .execute()

      if (queryResult.affected !== 1) {
        return res.sendStatus(500)
      }
      return res.sendStatus(200)
    } catch (err) {
      return res.sendStatus(500)
    }
  }
)

router.get('/company', authorization, async (_: Request, res: Response) => {
  try {
    const company = await getConnection()
      .getRepository(Company)
      .createQueryBuilder('company')
      .getOne()

    return res.status(200).json(company ? company : null)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

router.delete(
  '/company/:id',
  authorization,
  async (req: Request, res: Response) => {
    const companyId: number = parseInt(req.params.id)

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Company)
        .where('id = :id', { id: companyId })
        .execute()

      if (queryResult.affected !== 1) {
        return res.sendStatus(500)
      }
      return res.sendStatus(200)
    } catch (err) {
      return res.sendStatus(500)
    }
  }
)

export { router as company }
