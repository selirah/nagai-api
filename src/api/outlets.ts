import { router } from '../utils'
import { Request, Response } from 'express'
import { Outlet } from '../entities/Outlet'
import { authorization } from '../middleware/auth'
import { getConnection, Brackets } from 'typeorm'
import { validateOutlet, barcodeExist } from '../validations'
import { __Outlet__ } from '../models/__Outlet__'

router.post('/outlets', authorization, async (req: Request, res: Response) => {
  const inputs: __Outlet__ = req.body
  const errors = validateOutlet(inputs)

  if (errors) {
    return res.status(400).json({ errors })
  }

  let outlet: __Outlet__
  try {
    const queryResult = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Outlet)
      .values({
        ownerName: inputs.ownerName.toLowerCase(),
        outletName: inputs.outletName.toLowerCase(),
        mobile: inputs.mobile,
        telephone: inputs.telephone,
        email: inputs.email,
        locality: inputs.locality.toLowerCase(),
        barcode: inputs.barcode,
        subLocality: inputs.subLocality.toLowerCase(),
        landmark: inputs.landmark,
        coordinates: inputs.coordinates,
        territoryId: inputs.territoryId
      })
      .returning('*')
      .execute()

    outlet = queryResult.raw[0]
    if (!outlet) {
      return res.sendStatus(500)
    }
  } catch (err) {
    const errors = barcodeExist(inputs, err)
    if (errors) {
      return res.status(400).json({ errors })
    }
  }

  return res.sendStatus(201)
})

router.put(
  '/outlets/:id',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Outlet__ = req.body
    const errors = validateOutlet(inputs)
    const id: number = parseInt(req.params.id)

    if (errors) {
      return res.status(400).json({ errors })
    }

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .update(Outlet)
        .set({
          ownerName: inputs.ownerName.toLowerCase(),
          outletName: inputs.outletName.toLowerCase(),
          mobile: inputs.mobile,
          telephone: inputs.telephone,
          email: inputs.email,
          locality: inputs.locality.toLowerCase(),
          barcode: inputs.barcode,
          subLocality: inputs.subLocality.toLowerCase(),
          landmark: inputs.landmark,
          coordinates: inputs.coordinates,
          territoryId: inputs.territoryId,
          photo: inputs.photo
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

router.get('/outlets', authorization, async (req: Request, res: Response) => {
  const page = req.query.page !== undefined ? +req.query.page : 10
  const skip = req.query.skip !== undefined ? +req.query.skip : 0
  const territory = req.query.territory !== undefined ? +req.query.territory : 0
  const query = req.query.query

  try {
    if (territory !== 0) {
      const [outlets, count] = await getConnection()
        .getRepository(Outlet)
        .createQueryBuilder('outlets')
        .leftJoinAndSelect('outlets.territory', 'territory')
        .where('outlets."territoryId" = :territory_id', {
          territory_id: territory
        })
        .andWhere(
          new Brackets((sqb) => {
            sqb.where('outlets."barcode" like :query', {
              query: `%${query?.toString()}%`
            })
            sqb.orWhere('outlets."outletName" like :query', {
              query: `%${query?.toString().toLowerCase()}%`
            })
            sqb.orWhere('outlets."ownerName" like :query', {
              query: `%${query?.toString().toLowerCase()}%`
            })
          })
        )
        .skip(skip)
        .take(page)
        .getManyAndCount()
      return res.status(200).json({ outlets, count })
    } else {
      const [outlets, count] = await getConnection()
        .getRepository(Outlet)
        .createQueryBuilder('outlets')
        .leftJoinAndSelect('outlets.territory', 'territory')
        .where('outlets."barcode" like :query', {
          query: `%${query?.toString()}%`
        })
        .orWhere('outlets."outletName" like :query', {
          query: `%${query?.toString().toLowerCase()}%`
        })
        .orWhere('outlets."ownerName" like :query', {
          query: `%${query?.toString().toLowerCase()}%`
        })
        .skip(skip)
        .take(page)
        .getManyAndCount()
      return res.status(200).json({ outlets, count })
    }
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

router.delete(
  '/outlets/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id)

    try {
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
    } catch (err) {
      console.log(err)
    }
    return res.sendStatus(200)
  }
)

router.post(
  '/outlets/bulk',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Outlet__[] = req.body
    try {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Outlet)
        .values(inputs)
        .execute()
    } catch (err) {
      console.log(err)
    }

    return res.sendStatus(201)
  }
)

export { router as outlets }
