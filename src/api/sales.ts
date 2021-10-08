import { router } from '../utils'
import { Request, Response } from 'express'
import { Sale, SaleStatus } from '../entities/Sale'
import { authorization } from '../middleware/auth'
import { getConnection, Brackets } from 'typeorm'
import { __Sale__ } from '../models/__Sale__'
import { validateSale } from '../validations'
import { isEmpty } from '../validations/isEmpty'

router.post('/sales', authorization, async (req: Request, res: Response) => {
  const inputs: __Sale__ = req.body
  const errors = validateSale(inputs)

  if (errors) {
    return res.status(400).json({ errors })
  }

  try {
    const queryResult = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Sale)
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
})

router.put('/sales/:id', authorization, async (req: Request, res: Response) => {
  const inputs: __Sale__ = req.body
  const errors = validateSale(inputs)
  const id: string = req.params.id

  if (errors) {
    return res.status(400).json({ errors })
  }

  try {
    const queryResult = await getConnection()
      .createQueryBuilder()
      .update(Sale)
      .set({
        status: inputs.status,
        comments: inputs.comments
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
    return res.sendStatus(500)
  }
  return res.sendStatus(200)
})

router.post(
  '/sales/bulk',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Sale__[] = req.body
    try {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Sale)
        .values(inputs)
        .execute()

      return res.sendStatus(201)
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
  }
)

router.get('/sales', authorization, async (req: Request, res: Response) => {
  const page = req.query.page !== undefined ? +req.query.page : 10
  const skip = req.query.skip !== undefined ? +req.query.skip : 0
  const query = req.query.query
  const fromDate = req.query.fromDate
  const toDate = req.query.toDate
  const status = req.query.status

  try {
    if (!isEmpty(fromDate) && !isEmpty(toDate) && status !== SaleStatus.ALL) {
      const [sales, count] = await getConnection()
        .getRepository(Sale)
        .createQueryBuilder('sales')
        .leftJoinAndSelect('sales.order', 'order')
        .leftJoinAndSelect('sales.invoice', 'invoice')
        .leftJoinAndSelect('sales.payments', 'payments')
        .where(`sales.createdAt BETWEEN '${fromDate}' AND '${toDate}'`)
        .andWhere('sales."status" = :status', { status: status })
        .andWhere(
          new Brackets((sqb) => {
            sqb.where('sales."id" like :query', {
              query: `%${query?.toString().toUpperCase()}%`
            })
            sqb.orWhere('sales."orderId" like :query', {
              query: `%${query?.toString().toLowerCase()}%`
            })
            sqb.orWhere('sales."invoiceId" like :query', {
              query: `%${query?.toString().toLowerCase()}%`
            })
          })
        )
        .skip(skip)
        .take(page)
        .getManyAndCount()
      return res.status(200).json({ sales, count })
    } else if (
      !isEmpty(fromDate) &&
      !isEmpty(toDate) &&
      status === SaleStatus.ALL
    ) {
      const [sales, count] = await getConnection()
        .getRepository(Sale)
        .createQueryBuilder('sales')
        .leftJoinAndSelect('sales.order', 'order')
        .leftJoinAndSelect('sales.invoice', 'invoice')
        .leftJoinAndSelect('sales.payments', 'payments')
        .where(`sales.createdAt BETWEEN '${fromDate}' AND '${toDate}'`)
        .andWhere(
          new Brackets((sqb) => {
            sqb.where('sales."id" like :query', {
              query: `%${query?.toString().toUpperCase()}%`
            })
            sqb.orWhere('sales."orderId" like :query', {
              query: `%${query?.toString().toLowerCase()}%`
            })
            sqb.orWhere('sales."invoiceId" like :query', {
              query: `%${query?.toString().toLowerCase()}%`
            })
          })
        )
        .skip(skip)
        .take(page)
        .getManyAndCount()
      return res.status(200).json({ sales, count })
    } else if (
      isEmpty(fromDate) &&
      isEmpty(toDate) &&
      status !== SaleStatus.ALL
    ) {
      const [sales, count] = await getConnection()
        .getRepository(Sale)
        .createQueryBuilder('sales')
        .leftJoinAndSelect('sales.order', 'order')
        .leftJoinAndSelect('sales.invoice', 'invoice')
        .leftJoinAndSelect('sales.payments', 'payments')
        .where('sales."status" = :status', { status: status })
        .andWhere(
          new Brackets((sqb) => {
            sqb.where('sales."id" like :query', {
              query: `%${query?.toString().toUpperCase()}%`
            })
            sqb.orWhere('sales."orderId" like :query', {
              query: `%${query?.toString().toLowerCase()}%`
            })
            sqb.orWhere('sales."invoiceId" like :query', {
              query: `%${query?.toString().toLowerCase()}%`
            })
          })
        )
        .skip(skip)
        .take(page)
        .getManyAndCount()
      return res.status(200).json({ sales, count })
    } else {
      const [sales, count] = await getConnection()
        .getRepository(Sale)
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
      return res.status(200).json({ sales, count })
    }
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

export { router as sales }
