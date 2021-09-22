import { router /*, sendEmail*/ } from '../utils'
import { Request, Response } from 'express'
import { Order } from '../entities/Order'
import { authorization } from '../middleware/auth'
import { getConnection, Brackets } from 'typeorm'
import { validateOrder } from '../validations'
import { __Order__ } from '../models/__Order__'
import { __Item__ } from '../models/__Item__'
import { isEmpty } from '../validations/isEmpty'

router.post('/orders', authorization, async (req: Request, res: Response) => {
  const inputs: __Order__ = req.body
  const errors = validateOrder(inputs)

  if (errors) {
    return res.status(400).json({ errors })
  }

  let order: __Order__
  const queryResult = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Order)
    .values({
      orderNumber: inputs.orderNumber,
      items: inputs.items,
      orderTotal: inputs.orderTotal,
      outletId: inputs.outletId,
      agentId: inputs.agentId
    })
    .returning('*')
    .execute()

  order = queryResult.raw[0]
  if (!order) {
    return res.sendStatus(500)
  }
  return res.sendStatus(201)
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
        orderNumber: inputs.orderNumber,
        items: inputs.items,
        orderTotal: inputs.orderTotal,
        outletId: inputs.outletId,
        agentId: inputs.agentId
      })
      .where('"id" = :id', {
        id: id
      })
      .execute()

    if (queryResult.affected !== 1) {
      return res.sendStatus(500)
    }
    return res.sendStatus(200)
  }
)

router.get('/orders', authorization, async (req: Request, res: Response) => {
  const page = req.query.page !== undefined ? +req.query.page : 10
  const skip = req.query.skip !== undefined ? +req.query.skip : 0
  const query = req.query.query
  const fromDate = req.query.fromDate
  const toDate = req.query.toDate

  if (!isEmpty(fromDate) && !isEmpty(toDate)) {
    const [orders, count] = await getConnection()
      .getRepository(Order)
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.outlet', 'outlet')
      .leftJoinAndSelect('orders.agent', 'agent')
      .leftJoinAndSelect('orders.invoice', 'invoice')
      .leftJoinAndSelect('orders.delivery', 'delivery')
      .where(`orders.createdAt BETWEEN '${fromDate}' AND '${toDate}'`)
      .andWhere(
        new Brackets((sqb) => {
          sqb.where('orders."orderNumber" like :query', {
            query: `%${query?.toString()}%`
          })
        })
      )
      .skip(skip)
      .take(page)
      .getManyAndCount()
    return res.status(200).json({ orders, count })
  } else {
    const [orders, count] = await getConnection()
      .getRepository(Order)
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.outlet', 'outlet')
      .leftJoinAndSelect('orders.agent', 'agent')
      .leftJoinAndSelect('orders.invoice', 'invoice')
      .leftJoinAndSelect('orders.delivery', 'delivery')
      .where('stock."orderNumber" like :query', {
        query: `%${query?.toString()}%`
      })
      .skip(skip)
      .take(page)
      .getManyAndCount()
    return res.status(200).json({ orders, count })
  }
})

router.get(
  '/orders/:outletId',
  authorization,
  async (req: Request, res: Response) => {
    const page = req.query.page !== undefined ? +req.query.page : 10
    const skip = req.query.skip !== undefined ? +req.query.skip : 0
    const outletId: string = req.params.outletId

    try {
      const [orders, count] = await getConnection()
        .getRepository(Order)
        .createQueryBuilder('orders')
        .leftJoinAndSelect('orders.agent', 'agent')
        .where('orders."outletId" = :outletId', { outletId: outletId })
        .skip(skip)
        .take(page)
        .getManyAndCount()

      return res.status(200).json({ orders, count })
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
  }
)

router.delete(
  '/orders/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: string = req.params.id

    const queryResult = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Order)
      .where('"id" = :id', {
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
