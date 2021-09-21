import { router, sendEmail, sendSMS } from '../utils'
import { Request, Response } from 'express'
import { Delivery } from '../entities/Delivery'
import { Order } from '../entities/Order'
import { Outlet } from '../entities/Outlet'
import { authorization } from '../middleware/auth'
import { getConnection } from 'typeorm'
import { validateDelivery } from '../validations'
import { __Delivery__ } from '../models/__Delivery__'
import moment from 'moment'

enum UserType {
  dispatch = 'dispatch',
  agent = 'agent'
}

router.post(
  '/deliveries',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Delivery__ = req.body
    const errors = validateDelivery(inputs)

    if (errors) {
      return res.status(400).json({ errors })
    }

    let delivery: __Delivery__
    const queryResult = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Delivery)
      .values({
        orderId: inputs.orderId,
        dispatchId: inputs.dispatchId
      })
      .returning('*')
      .execute()

    delivery = queryResult.raw[0]
    if (!delivery) {
      return res.sendStatus(500)
    }

    const dlvy = await getConnection()
      .getRepository(Delivery)
      .createQueryBuilder('delivery')
      .innerJoinAndSelect('delivery.order', 'order')
      .where('"id" = :id', {
        id: delivery.id
      })
      .getOne()

    return res.status(201).json(dlvy)
  }
)

router.put(
  '/deliveries/:id',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Delivery__ = req.body
    const errors = validateDelivery(inputs)
    const id: string = req.params.id

    if (errors) {
      return res.status(400).json({ errors })
    }

    const queryResult = await getConnection()
      .createQueryBuilder()
      .update(Delivery)
      .set({
        orderId: inputs.orderId,
        dispatchId: inputs.dispatchId,
        deliveryDate: moment(new Date()).format('YYYY-MM-DD HH:MM:SS'),
        isDelivered: inputs.isDelivered,
        reason: inputs.reason
      })
      .where('"id" = :id', {
        id: id
      })
      .execute()

    if (queryResult.affected !== 1) {
      return res.sendStatus(500)
    }
    // check if order is delivered
    if (inputs.isDelivered) {
      // send email and sms to client about order delivery
      const order = await Order.findOne({
        where: { orderId: inputs.orderId }
      })
      if (order) {
        const outlet = await Outlet.findOne({
          where: { outletId: order.outletId }
        })
        if (outlet) {
          const emailMessage = `<h2>Hello ${outlet.outletName}, your order ${order.id} has been successfully delivered. Cheers</h2>`
          const smsMessage = `Hello ${outlet.outletName}, your order ${order.id} has been successfully delivered. Cheers`
          await sendEmail(outlet.email, emailMessage)
          await sendSMS(outlet.mobile, smsMessage)
        }
      }
    }

    const delivery = await getConnection()
      .getRepository(Delivery)
      .createQueryBuilder('delivery')
      .innerJoinAndSelect('delivery.order', 'order')
      .where('"id" = :id', {
        id: id
      })
      .getOne()

    if (!delivery) {
      return res.sendStatus(500)
    }

    return res.status(200).json(delivery)
  }
)

router.get(
  '/deliveries',
  authorization,
  async (req: Request, res: Response) => {
    const limit = req.query.limit !== undefined ? +req.query.limit : 100
    const offset = req.query.offset !== undefined ? +req.query.offset : 0
    const deliveries = await getConnection()
      .getRepository(Delivery)
      .createQueryBuilder('deliveries')
      .innerJoinAndSelect('deliveries.order', 'order')
      .skip(offset)
      .take(limit)
      .getMany()

    return res.status(200).json(deliveries)
  }
)

router.get(
  '/deliveries/:type/:id',
  authorization,
  async (req: Request, res: Response) => {
    const limit = req.query.limit !== undefined ? +req.query.limit : 100
    const offset = req.query.offset !== undefined ? +req.query.offset : 0
    const type: string = req.params.type
    const id: number = parseInt(req.params.id)

    let deliveries
    switch (type) {
      case UserType.dispatch:
        deliveries = await getConnection()
          .getRepository(Delivery)
          .createQueryBuilder('deliveries')
          .innerJoinAndSelect('deliveries.order', 'order')
          .where('deliveries."dispatchId" = :dispatchId', {
            dispatchId: id
          })
          // .orderBy('deliveries."createdAt"', 'DESC')
          .skip(offset)
          .take(limit)
          .getMany()
        break
      case UserType.agent:
        deliveries = await getConnection()
          .getRepository(Delivery)
          .createQueryBuilder('deliveries')
          .innerJoinAndSelect('deliveries.order', 'order')
          .where('deliveries."agentId" = :agentId', {
            agentId: id
          })
          // .orderBy('deliveries."createdAt"', 'DESC')
          .skip(offset)
          .take(limit)
          .getMany()
        break
    }
    return res.status(200).json(deliveries)
  }
)

export { router as deliveries }
