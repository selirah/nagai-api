import { router } from 'utils'
import { Request, Response } from 'express'
import { Payment } from 'entities/Payment'
import { Transaction } from 'entities/Transaction'
import { authorization } from 'middleware/auth'
import { getConnection } from 'typeorm'
import { validatePayments } from 'validations'
import { __Payment__ } from 'models/__Payment__'
import moment from 'moment'

router.post('/payments', authorization, async (req: Request, res: Response) => {
  const inputs: __Payment__ = req.body
  const errors = validatePayments(inputs)

  if (errors) {
    return res.status(400).json({ errors })
  }

  let payment: __Payment__
  const queryResult = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Payment)
    .values({
      paymentId: `PAY-${moment(new Date()).format('YMDHHMMSS')}`,
      transactionId: inputs.transactionId,
      amount: inputs.amount,
      payer: inputs.payer,
      payerPhone: inputs.payerPhone,
      payee: req.user
    })
    .returning('*')
    .execute()

  payment = queryResult.raw[0]
  if (!payment) {
    return res.sendStatus(500)
  }
  // update the transaction entity with this new payment made
  const updateTransaction = await getConnection()
    .createQueryBuilder()
    .update(Transaction)
    .set({
      amountPaid: () => `"amountPaid" + ${inputs.amount}`
    })
    .where('"transactionId" = :transactionId', {
      transactionId: payment.transactionId
    })
    .execute()

  if (updateTransaction.affected !== 1) {
    return res.sendStatus(500)
  }
  return res.status(201).json(payment)
})

router.get('/payments', authorization, async (req: Request, res: Response) => {
  const limit = req.query.limit !== undefined ? +req.query.limit : 100
  const offset = req.query.offset !== undefined ? +req.query.offset : 0

  const products = await getConnection()
    .getRepository(Payment)
    .createQueryBuilder('payments')
    .skip(offset)
    .take(limit)
    .getMany()

  return res.status(200).json(products)
})

router.get(
  '/payments/:transactionId',
  authorization,
  async (req: Request, res: Response) => {
    const limit = req.query.limit !== undefined ? +req.query.limit : 100
    const offset = req.query.offset !== undefined ? +req.query.offset : 0
    const transactionId: string = req.params.transactionId

    const products = await getConnection()
      .getRepository(Payment)
      .createQueryBuilder('payments')
      .where('payments."transactionId" = :transactionId', {
        transactionId: transactionId
      })
      .skip(offset)
      .take(limit)
      .getMany()

    return res.status(200).json(products)
  }
)

export { router as payments }
