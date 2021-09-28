import { router } from '../utils'
import { Request, Response } from 'express'
import { Region } from '../entities/Region'
import { City } from '../entities/City'
import { Unit } from '../entities/Unit'
import { Territory } from '../entities/Territory'
import { Outlet } from '../entities/Outlet'
import { Tax } from '../entities/Tax'
import { getConnection } from 'typeorm'

router.get('/utils/regions', async (_: Request, res: Response) => {
  try {
    const regions = await getConnection()
      .getRepository(Region)
      .createQueryBuilder('regions')
      .getMany()

    return res.status(200).json(regions)
  } catch (err) {
    return res.sendStatus(500)
  }
})

router.get('/utils/cities', async (_: Request, res: Response) => {
  try {
    const cities = await getConnection()
      .getRepository(City)
      .createQueryBuilder('cities')
      .getMany()

    return res.status(200).json(cities)
  } catch (err) {
    return res.sendStatus(500)
  }
})

router.get('/utils/units', async (_: Request, res: Response) => {
  try {
    const units = await getConnection()
      .getRepository(Unit)
      .createQueryBuilder('units')
      .getMany()

    return res.status(200).json(units)
  } catch (err) {
    return res.sendStatus(500)
  }
})

router.get('/utils/territories', async (_: Request, res: Response) => {
  try {
    const territories = await getConnection()
      .getRepository(Territory)
      .createQueryBuilder('territories')
      .leftJoinAndSelect('territories.region', 'region')
      .getMany()

    return res.status(200).json(territories)
  } catch (err) {
    return res.sendStatus(500)
  }
})

router.get('/utils/outlets', async (_: Request, res: Response) => {
  try {
    const outlets = await getConnection()
      .getRepository(Outlet)
      .createQueryBuilder('outlets')
      .getMany()

    return res.status(200).json(outlets)
  } catch (err) {
    return res.sendStatus(500)
  }
})

router.get('/utils/taxes', async (_: Request, res: Response) => {
  try {
    const taxes = await getConnection()
      .getRepository(Tax)
      .createQueryBuilder('taxes')
      .getMany()

    return res.status(200).json(taxes)
  } catch (err) {
    return res.sendStatus(500)
  }
})

export { router as utils }
