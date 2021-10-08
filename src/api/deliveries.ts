import { router } from '../utils'
import { Request, Response } from 'express'
import { Delivery } from '../entities/Delivery'
import { Order, Status } from '../entities/Order'
import { Outlet } from '../entities/Outlet'
import { authorization } from '../middleware/auth'
import { getConnection } from 'typeorm'
import { validateDelivery } from '../validations'
import { __Delivery__ } from '../models/__Delivery__'
import { isEmpty } from '../validations/isEmpty'

router.post(
  '/deliveries',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Delivery__ = req.body
    const errors = validateDelivery(inputs)

    if (errors) {
      return res.status(400).json({ errors })
    }

    const findOne = await Delivery.findOne({
      where: {
        orderId: inputs.orderId
      }
    })

    if (findOne) {
      const errors = [
        {
          field: 'orderId',
          message: `Order number ${inputs.orderId} has already been assigned to a dispatch`
        }
      ]
      return res.status(400).json({ errors })
    }

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Delivery)
        .values({
          orderId: inputs.orderId,
          dispatchId: inputs.dispatchId,
          isDelivered: false
        })
        .returning('*')
        .execute()

      if (!queryResult.raw[0]) {
        return res.sendStatus(500)
      }
      await Order.update({ id: inputs.orderId }, { status: Status.DISPATCH })
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    return res.sendStatus(201)
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

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .update(Delivery)
        .set({
          orderId: inputs.orderId,
          dispatchId: inputs.dispatchId,
          deliveryDate: inputs.deliveryDate,
          isDelivered: inputs.isDelivered,
          comments: inputs.comments,
          coordinates: inputs.coordinates
        })
        .where('"id" = :id', {
          id: id
        })
        .execute()

      if (queryResult.affected !== 1) {
        return res.sendStatus(500)
      }
      if (inputs.isDelivered) {
        await Order.update({ id: inputs.orderId }, { status: Status.DELIVERED })
      } else {
        await Order.update({ id: inputs.orderId }, { status: Status.FAILED })
      }
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    return res.sendStatus(200)
  }
)

router.get(
  '/deliveries',
  authorization,
  async (req: Request, res: Response) => {
    const page = req.query.page !== undefined ? +req.query.page : 10
    const skip = req.query.skip !== undefined ? +req.query.skip : 0
    const query = req.query.query
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate

    try {
      if (!isEmpty(fromDate) && !isEmpty(toDate)) {
        const [deliveries, count] = await getConnection()
          .getRepository(Delivery)
          .createQueryBuilder('deliveries')
          .leftJoinAndSelect('deliveries.order', 'order')
          .leftJoinAndSelect('deliveries.dispatch', 'dispatch')
          .where(`deliveries.createdAt BETWEEN '${fromDate}' AND '${toDate}'`)
          .andWhere('deliveries."orderId" like :query', {
            query: `%${query?.toString()}%`
          })
          .skip(skip)
          .take(page)
          .getManyAndCount()
        return res.status(200).json({ deliveries, count })
      } else {
        const [deliveries, count] = await getConnection()
          .getRepository(Delivery)
          .createQueryBuilder('deliveries')
          .leftJoinAndSelect('deliveries.order', 'order')
          .leftJoinAndSelect('deliveries.dispatch', 'dispatch')
          .where('deliveries."orderId" like :query', {
            query: `%${query?.toString()}%`
          })
          .skip(skip)
          .take(page)
          .getManyAndCount()
        return res.status(200).json({ deliveries, count })
      }
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
  }
)

router.get(
  '/deliveries/:id',
  authorization,
  async (req: Request, res: Response) => {
    const page = req.query.page !== undefined ? +req.query.page : 10
    const skip = req.query.skip !== undefined ? +req.query.skip : 0
    const id: number = parseInt(req.params.id)
    const query = req.query.query
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate

    try {
      if (!isEmpty(fromDate) && !isEmpty(toDate)) {
        const [deliveries, count] = await getConnection()
          .getRepository(Delivery)
          .createQueryBuilder('deliveries')
          .leftJoinAndSelect('deliveries.order', 'order')
          .leftJoinAndSelect('deliveries.dispatch', 'dispatch')
          .where('deliveries."dispatchId" = :dispatchId', {
            dispatchId: id
          })
          .andWhere(
            `deliveries.createdAt BETWEEN '${fromDate}' AND '${toDate}'`
          )
          .andWhere('deliveries."orderId" like :query', {
            query: `%${query?.toString()}%`
          })
          .skip(skip)
          .take(page)
          .getManyAndCount()
        return res.status(200).json({ deliveries, count })
      } else {
        const [deliveries, count] = await getConnection()
          .getRepository(Delivery)
          .createQueryBuilder('deliveries')
          .leftJoinAndSelect('deliveries.order', 'order')
          .leftJoinAndSelect('deliveries.dispatch', 'dispatch')
          .where('deliveries."dispatchId" = :dispatchId', {
            dispatchId: id
          })
          .andWhere('deliveries."orderId" like :query', {
            query: `%${query?.toString()}%`
          })
          .skip(skip)
          .take(page)
          .getManyAndCount()
        return res.status(200).json({ deliveries, count })
      }
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
  }
)

router.delete(
  '/deliveries/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: string = req.params.id

    const findOne = await Delivery.findOne({ where: { id: id } })

    if (findOne) {
      await Order.update({ id: findOne.orderId }, { status: Status.PENDING })
    }

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Delivery)
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
  }
)

router.get(
  '/deliveries/track/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: string = req.params.id
    try {
      const delivery = await getConnection()
        .getRepository(Delivery)
        .createQueryBuilder('deliveries')
        .leftJoinAndSelect('deliveries.order', 'order')
        .leftJoinAndSelect('deliveries.dispatch', 'dispatch')
        .where('deliveries."id" = :id', {
          id: id
        })
        .getOneOrFail()

      const outlet = await Outlet.findOne({
        where: { id: delivery.order.outletId }
      })

      return res.status(200).json({ delivery, outlet })
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
  }
)

export { router as deliveries }
