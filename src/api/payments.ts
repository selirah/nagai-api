import { router } from '../utils'
import { Request, Response } from 'express'
import { Payment } from '../entities/Payment'
import { Sale, SaleStatus } from '../entities/Sale'
import { authorization } from '../middleware/auth'
import { getConnection } from 'typeorm'
import { validatePayments } from '../validations'
import { __Payment__ } from '../models/__Payment__'
import { isEmpty } from '../validations/isEmpty'

router.post('/payments', authorization, async (req: Request, res: Response) => {
  const inputs: __Payment__ = req.body
  const errors = validatePayments(inputs)

  if (errors) {
    return res.status(400).json({ errors })
  }

  try {
    const queryResult = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Payment)
      .values({
        saleId: inputs.saleId,
        amount: inputs.amount,
        payer: inputs.payer,
        payerPhone: inputs.payerPhone,
        comments: inputs.comments,
        payee: req.user
      })
      .returning('*')
      .execute()
    if (!queryResult.raw[0]) {
      return res.sendStatus(500)
    }
    // update the Sale entity with this new payment made
    const updateSale = await getConnection()
      .createQueryBuilder()
      .update(Sale)
      .set({
        amountPaid: () => `"amountPaid" + ${inputs.amount}`,
        amountLeft: () => `"amount" - ${inputs.amount}`,
        status: SaleStatus.PAYING
      })
      .where('"id" = :saleId', {
        saleId: queryResult.raw[0].saleId
      })
      .execute()

    if (updateSale.affected !== 1) {
      return res.sendStatus(500)
    }
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }

  return res.sendStatus(201)
})

router.put(
  '/payments/:id',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Payment__ = req.body
    const errors = validatePayments(inputs)
    const id: string = req.params.id

    if (errors) {
      return res.status(400).json({ errors })
    }

    const findOne = await Payment.findOneOrFail({
      where: {
        id: id
      }
    })

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .update(Payment)
        .set({
          amount: inputs.amount,
          comments: inputs.comments
        })
        .where('"id" = :id', {
          id: id
        })
        .execute()

      if (queryResult.affected !== 1) {
        return res.sendStatus(500)
      }

      // update the Sale entity with this new payment made
      const updateSale = await getConnection()
        .createQueryBuilder()
        .update(Sale)
        .set({
          amountPaid: () =>
            `"amountPaid" + ${inputs.amount} - ${findOne.amount}`,
          amountLeft: () => `"amount" - ${inputs.amount} + ${findOne.amount}`,
          status: SaleStatus.PAYING
        })
        .where('"id" = :saleId', {
          saleId: inputs.saleId
        })
        .execute()

      if (updateSale.affected !== 1) {
        return res.sendStatus(500)
      }
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    return res.sendStatus(200)
  }
)

router.get('/payments', authorization, async (req: Request, res: Response) => {
  const page = req.query.page !== undefined ? +req.query.page : 10
  const skip = req.query.skip !== undefined ? +req.query.skip : 0
  const query = req.query.query
  const fromDate = req.query.fromDate
  const toDate = req.query.toDate

  try {
    if (!isEmpty(fromDate) && !isEmpty(toDate)) {
      const [payments, count] = await getConnection()
        .getRepository(Payment)
        .createQueryBuilder('payments')
        .leftJoinAndSelect('payments.payee', 'payee')
        .where(`payments.createdAt BETWEEN '${fromDate}' AND '${toDate}'`)
        .andWhere('payments."saleId" like :query', {
          query: `%${query?.toString().toUpperCase()}%`
        })
        .skip(skip)
        .take(page)
        .getManyAndCount()
      return res.status(200).json({ payments, count })
    } else {
      const [payments, count] = await getConnection()
        .getRepository(Payment)
        .createQueryBuilder('payments')
        .leftJoinAndSelect('payments.payee', 'payee')
        .where('payments."saleId" like :query', {
          query: `%${query?.toString().toUpperCase()}%`
        })
        .skip(skip)
        .take(page)
        .getManyAndCount()
      return res.status(200).json({ payments, count })
    }
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

export { router as payments }
