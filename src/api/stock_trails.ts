import { router } from '../utils'
import { Request, Response } from 'express'
import { StockTrail } from '../entities/StockTrail'
import { authorization } from '../middleware/auth'
import { getConnection } from 'typeorm'
import { __StockTrail__ } from '../models/__StockTrail__'
import { __User__ } from '../models/__User__'
import { isEmpty } from '../validations/isEmpty'

router.get(
  '/stock-trails',
  authorization,
  async (req: Request, res: Response) => {
    const page = req.query.page !== undefined ? +req.query.page : 100
    const skip = req.query.skip !== undefined ? +req.query.skip : 0
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate
    try {
      if (!isEmpty(fromDate) && !isEmpty(toDate)) {
        const [stockTrails, count] = await getConnection()
          .getRepository(StockTrail)
          .createQueryBuilder('trails')
          .leftJoinAndSelect('trails.user', 'user')
          .where(`trails.createdAt BETWEEN '${fromDate}' AND '${toDate}'`)
          .skip(skip)
          .take(page)
          .getManyAndCount()
        return res.status(200).json({ stockTrails, count })
      } else {
        const [stockTrails, count] = await getConnection()
          .getRepository(StockTrail)
          .createQueryBuilder('trails')
          .leftJoinAndSelect('trails.user', 'user')
          .skip(skip)
          .take(page)
          .getManyAndCount()
        return res.status(200).json({ stockTrails, count })
      }
    } catch (err) {
      console.log(err)
      return
    }
  }
)

router.get(
  '/stock-trails/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: string = req.params.id
    const page = req.query.page !== undefined ? +req.query.page : 100
    const skip = req.query.skip !== undefined ? +req.query.skip : 0
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate
    try {
      if (!isEmpty(fromDate) && !isEmpty(toDate)) {
        const [stockTrails, count] = await getConnection()
          .getRepository(StockTrail)
          .createQueryBuilder('trails')
          .leftJoinAndSelect('trails.user', 'user')
          .where('"stockId" = :id', {
            id: id
          })
          .andWhere(`trails.createdAt BETWEEN '${fromDate}' AND '${toDate}'`)
          .skip(skip)
          .take(page)
          .getManyAndCount()
        return res.status(200).json({ stockTrails, count })
      } else {
        const [stockTrails, count] = await getConnection()
          .getRepository(StockTrail)
          .createQueryBuilder('trails')
          .leftJoinAndSelect('trails.user', 'user')
          .where('"stockId" = :id', {
            id: id
          })
          .skip(skip)
          .take(page)
          .getManyAndCount()
        return res.status(200).json({ stockTrails, count })
      }
    } catch (err) {
      console.log(err)
      return
    }
  }
)

router.get(
  '/stock-trails/product/:id',
  authorization,
  async (req: Request, res: Response) => {
    const productId: string = req.params.id
    const page = req.query.page !== undefined ? +req.query.page : 100
    const skip = req.query.skip !== undefined ? +req.query.skip : 0
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate
    try {
      if (!isEmpty(fromDate) && !isEmpty(toDate)) {
        const [stockTrails, count] = await getConnection()
          .getRepository(StockTrail)
          .createQueryBuilder('trails')
          .leftJoinAndSelect('trails.user', 'user')
          .where('"productId" = :product_id', {
            product_id: productId
          })
          .andWhere(`trails.createdAt BETWEEN '${fromDate}' AND '${toDate}'`)
          .skip(skip)
          .take(page)
          .getManyAndCount()
        return res.status(200).json({ stockTrails, count })
      } else {
        const [stockTrails, count] = await getConnection()
          .getRepository(StockTrail)
          .createQueryBuilder('trails')
          .leftJoinAndSelect('trails.user', 'user')
          .where('"productId" = :product_id', {
            product_id: productId
          })
          .skip(skip)
          .take(page)
          .getManyAndCount()
        return res.status(200).json({ stockTrails, count })
      }
    } catch (err) {
      console.log(err)
      return
    }
  }
)

export { router as stockTrails }
