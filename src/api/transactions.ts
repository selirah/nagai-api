import { router } from '../utils'
import { Request, Response } from 'express'
import { Transaction } from '../entities/Transaction'
import { authorization } from '../middleware/auth'
import { getConnection } from 'typeorm'

router.get(
  '/transactions',
  authorization,
  async (req: Request, res: Response) => {
    const limit = req.query.limit !== undefined ? +req.query.limit : 100
    const offset = req.query.offset !== undefined ? +req.query.offset : 0

    const orders = await getConnection()
      .getRepository(Transaction)
      .createQueryBuilder('transactions')
      .innerJoinAndSelect('transactions.order', 'order')
      .leftJoinAndSelect('transactions.payments', 'payments')
      // .orderBy('transactions."createdAt"', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany()

    return res.status(200).json(orders)
  }
)

router.get(
  '/transactions/:orderId',
  authorization,
  async (req: Request, res: Response) => {
    const limit = req.query.limit !== undefined ? +req.query.limit : 100
    const offset = req.query.offset !== undefined ? +req.query.offset : 0
    const orderId: string = req.params.orderId

    const orders = await getConnection()
      .getRepository(Transaction)
      .createQueryBuilder('transactions')
      .leftJoinAndSelect('transactions.payments', 'payments')
      .where('transactions."orderId" = :orderId', { orderId: orderId })
      // .orderBy('transactions."createdAt"', 'DESC')
      .skip(offset)
      .take(limit)
      .getOne()

    return res.status(200).json(orders)
  }
)

export { router as transactions }
