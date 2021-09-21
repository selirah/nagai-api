import { router } from '../utils'
import { Request, Response } from 'express'
import { Region } from '../entities/Region'
import { City } from '../entities/City'
import { Unit } from '../entities/Unit'
import { Territory } from '../entities/Territory'
import { getConnection } from 'typeorm'

router.get('/utils/regions', async (_: Request, res: Response) => {
  const regions = await getConnection()
    .getRepository(Region)
    .createQueryBuilder('regions')
    .getMany()

  return res.status(200).json(regions)
})

router.get('/utils/cities', async (_: Request, res: Response) => {
  const cities = await getConnection()
    .getRepository(City)
    .createQueryBuilder('cities')
    .getMany()

  return res.status(200).json(cities)
})

router.get('/utils/units', async (_: Request, res: Response) => {
  const units = await getConnection()
    .getRepository(Unit)
    .createQueryBuilder('units')
    .getMany()

  return res.status(200).json(units)
})

router.get('/utils/territories', async (_: Request, res: Response) => {
  const units = await getConnection()
    .getRepository(Territory)
    .createQueryBuilder('territories')
    .leftJoinAndSelect('territories.region', 'region')
    .getMany()

  return res.status(200).json(units)
})

export { router as utils }
