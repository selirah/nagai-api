import { router } from '../utils'
import { Request, Response } from 'express'
import { Transaction } from '../entities/Transaction'
import { authorization } from '../middleware/auth'
import { getConnection, Brackets } from 'typeorm'
import { __Transaction__ } from '../models/__Transaction__'
import { validateTransaction } from '../validations'
import { isEmpty } from '../validations/isEmpty'

router.post(
  '/transactions',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Transaction__ = req.body
    const errors = validateTransaction(inputs)

    if (errors) {
      return res.status(400).json({ errors })
    }

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Transaction)
        .values({
          id: inputs.id,
          orderId: inputs.orderId,
          invoiceId: inputs.invoiceId,
          amount: inputs.amount,
          amountPaid: inputs.amountPaid
        })
        .returning('*')
        .execute()

      if (!queryResult.raw[0]) {
        return res.sendStatus(500)
      }
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    return res.sendStatus(201)
  }
)

router.post(
  '/transactions/bulk',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Transaction__[] = req.body
    try {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Transaction)
        .values(inputs)
        .execute()

      return res.sendStatus(201)
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
  }
)

router.get(
  '/transactions',
  authorization,
  async (req: Request, res: Response) => {
    const page = req.query.page !== undefined ? +req.query.page : 10
    const skip = req.query.skip !== undefined ? +req.query.skip : 0
    const query = req.query.query
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate

    try {
      if (!isEmpty(fromDate) && !isEmpty(toDate)) {
        const [transactions, count] = await getConnection()
          .getRepository(Transaction)
          .createQueryBuilder('transactions')
          .leftJoinAndSelect('transactions.order', 'order')
          .leftJoinAndSelect('transactions.invoice', 'invoice')
          .leftJoinAndSelect('transactions.payments', 'payments')
          .where(`transactions.createdAt BETWEEN '${fromDate}' AND '${toDate}'`)
          .andWhere(
            new Brackets((sqb) => {
              sqb.where('transactions."id" like :query', {
                query: `%${query?.toString().toUpperCase()}%`
              })
              sqb.orWhere('transactions."orderId" like :query', {
                query: `%${query?.toString().toLowerCase()}%`
              })
              sqb.orWhere('transactions."invoiceId" like :query', {
                query: `%${query?.toString().toLowerCase()}%`
              })
            })
          )
          .skip(skip)
          .take(page)
          .getManyAndCount()
        return res.status(200).json({ transactions, count })
      } else {
        const [transactions, count] = await getConnection()
          .getRepository(Transaction)
          .createQueryBuilder('transactions')
          .leftJoinAndSelect('transactions.order', 'order')
          .leftJoinAndSelect('transactions.invoice', 'invoice')
          .leftJoinAndSelect('transactions.payments', 'payments')
          .where('transactions."id" like :query', {
            query: `%${query?.toString().toUpperCase()}%`
          })
          .orWhere('transactions."orderId" like :query', {
            query: `%${query?.toString().toLowerCase()}%`
          })
          .orWhere('transactions."invoiceId" like :query', {
            query: `%${query?.toString().toLowerCase()}%`
          })
          .skip(skip)
          .take(page)
          .getManyAndCount()
        return res.status(200).json({ transactions, count })
      }
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
  }
)

export { router as transactions }
