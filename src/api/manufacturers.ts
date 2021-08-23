import { router } from '../utils'
import { Request, Response } from 'express'
import { Manufacturer } from '../entities/Manufacturer'
import { authorization } from '../middleware/auth'
import { getConnection } from 'typeorm'
import { validateManufacturer } from '../validations'
import { __Manufacturer__ } from '../models/__Manufacturer__'
import { sanitizePhone } from '../helper/functions'

router.post(
  '/manufacturers',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Manufacturer__ = req.body
    const errors = validateManufacturer(inputs)

    if (errors) {
      return res.status(400).json({ errors })
    }

    let manufacturer: __Manufacturer__

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Manufacturer)
        .values({
          name: inputs.name,
          email: inputs.email,
          phone: sanitizePhone(inputs.phone),
          coordinates: inputs.coordinates,
          location: inputs.location,
          logo: inputs.logo
        })
        .returning('*')
        .execute()

      manufacturer = queryResult.raw[0]
      if (!manufacturer) {
        return res.sendStatus(500)
      }
    } catch (err) {
      console.log(err)
    }

    return res.sendStatus(201)
  }
)

router.put(
  '/manufacturers/:id',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Manufacturer__ = req.body
    const errors = validateManufacturer(inputs)
    const id: number = parseInt(req.params.id)

    if (errors) {
      return res.status(400).json({ errors })
    }

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .update(Manufacturer)
        .set({
          name: inputs.name,
          email: inputs.email,
          phone: sanitizePhone(inputs.phone),
          coordinates: inputs.coordinates,
          location: inputs.location,
          logo: inputs.logo
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

router.get(
  '/manufacturers',
  authorization,
  async (_: Request, res: Response) => {
    const manufacturers = await getConnection()
      .getRepository(Manufacturer)
      .createQueryBuilder('manufacturers')
      .leftJoinAndSelect('manufacturers.products', 'product')
      .orderBy('manufacturers."createdAt"', 'DESC')
      .getMany()

    return res.status(200).json(manufacturers)
  }
)

router.delete(
  '/manufacturers/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id)

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Manufacturer)
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

export { router as manufacturers }
