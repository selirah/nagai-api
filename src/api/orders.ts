import { router /*, sendEmail*/ } from '../utils'
import { Request, Response } from 'express'
import { Order } from '../entities/Order'
import { Transaction } from '../entities/Transaction'
// import { Client } from '../entities/Client';
import { authorization } from '../middleware/auth'
import { getConnection } from 'typeorm'
import { validateOrder } from '../validations'
import { __Order__ } from '../models/__Order__'
import moment from 'moment'
import { __Item__ } from 'src/models/__Item__'

router.post('/orders', authorization, async (req: Request, res: Response) => {
  const inputs: __Order__ = req.body
  const errors = validateOrder(inputs)

  if (errors) {
    return res.status(400).json({ errors })
  }

  let order: __Order__
  const orderId = moment(new Date()).format('YMDHHMMSS')
  const queryResult = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Order)
    .values({
      orderId: orderId,
      items: inputs.items,
      vat: inputs.vat,
      discount: inputs.discount,
      clientId: inputs.clientId
    })
    .returning('*')
    .execute()

  order = queryResult.raw[0]
  if (!order) {
    return res.sendStatus(500)
  }

  // Now save this as a transaction in the transaction entity
  // first we need to calculate the sales (including factoring VAT, discount, and other charges)
  const { items }: any = order
  let subtotal = 0.0
  for (let item of items) {
    subtotal += item.unitPrice * item.quantity
  }
  let total = 0.0
  const vatCharge = (order.vat / 100) * subtotal
  const discount = (order.discount / 100) * subtotal
  total = subtotal + vatCharge - discount

  const saveTransaction = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Transaction)
    .values({
      transactionId: `TRX-${moment(new Date()).format('YMDHHMMSS')}`,
      orderId: order.orderId,
      amount: total,
      amountPaid: 0.0
    })
    .execute()
  if (!saveTransaction) {
    return res.sendStatus(500)
  }
  // // // send invoice to client
  // const client = await Client.findOne({ where: { clientId: inputs.clientId } });
  // if (client) {
  //   const emailMessage = `<h2>Hello ${client.businessName}, your order ${orderId} has been placed successfully. Cheers</h2>`;
  //   await sendEmail(client.businessEmail, emailMessage);
  // }
  return res.status(201).json(order)
})

router.put(
  '/orders/:id',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Order__ = req.body
    const errors = validateOrder(inputs)
    const id: string = req.params.id

    if (errors) {
      return res.status(400).json({ errors })
    }

    const queryResult = await getConnection()
      .createQueryBuilder()
      .update(Order)
      .set({
        items: inputs.items,
        vat: inputs.vat,
        discount: inputs.discount,
        clientId: inputs.clientId
      })
      .where('"orderId" = :id', {
        id: id
      })
      .execute()

    if (queryResult.affected !== 1) {
      return res.sendStatus(500)
    }
    const order = await getConnection()
      .getRepository(Order)
      .createQueryBuilder('order')
      .where('"orderId" = :id', {
        id: id
      })
      .getOne()

    if (!order) {
      return res.sendStatus(500)
    }

    return res.status(200).json(order)
  }
)

router.get('/orders', authorization, async (req: Request, res: Response) => {
  const limit = req.query.limit !== undefined ? +req.query.limit : 100
  const offset = req.query.offset !== undefined ? +req.query.offset : 0

  const orders = await getConnection()
    .getRepository(Order)
    .createQueryBuilder('orders')
    // .innerJoinAndSelect('orders.client', 'client')
    .skip(offset)
    .take(limit)
    .getMany()

  return res.status(200).json(orders)
})

router.get(
  '/orders/:clientId',
  authorization,
  async (req: Request, res: Response) => {
    const limit = req.query.limit !== undefined ? +req.query.limit : 100
    const offset = req.query.offset !== undefined ? +req.query.offset : 0
    const clientId: string = req.params.clientId

    const orders = await getConnection()
      .getRepository(Order)
      .createQueryBuilder('orders')
      .where('orders."clientId" = :clientId', { clientId: clientId })
      .skip(offset)
      .take(limit)
      .getMany()

    return res.status(200).json(orders)
  }
)

router.delete(
  '/orders/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id)

    const queryResult = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Order)
      .where('"productId" = :id', {
        id: id
      })
      .execute()

    if (queryResult.affected !== 1) {
      return res.sendStatus(500)
    }
    return res.sendStatus(204)
  }
)

export { router as orders }
