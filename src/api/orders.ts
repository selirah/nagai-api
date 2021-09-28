import { router /*, sendEmail*/ } from '../utils'
import { Request, Response } from 'express'
import { Order, Status } from '../entities/Order'
import { authorization } from '../middleware/auth'
import { getConnection } from 'typeorm'
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

  try {
    const queryResult = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Order)
      .values({
        id: inputs.orderNumber,
        items: inputs.items,
        orderTotal: inputs.orderTotal,
        outletId: inputs.outletId,
        agentId: inputs.agentId
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

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .update(Order)
        .set({
          status: inputs.status.toUpperCase(),
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
  }
)

router.get('/orders', authorization, async (req: Request, res: Response) => {
  const page = req.query.page !== undefined ? +req.query.page : 10
  const skip = req.query.skip !== undefined ? +req.query.skip : 0
  const query = req.query.query
  const fromDate = req.query.fromDate
  const toDate = req.query.toDate
  const status = req.query.status

  try {
    if (!isEmpty(fromDate) && !isEmpty(toDate) && status !== Status.ALL) {
      const [orders, count] = await getConnection()
        .getRepository(Order)
        .createQueryBuilder('orders')
        .leftJoinAndSelect('orders.outlet', 'outlet')
        .leftJoinAndSelect('orders.agent', 'agent')
        .leftJoinAndSelect('orders.invoice', 'invoice')
        .leftJoinAndSelect('orders.delivery', 'delivery')
        .where('orders."status" = :status', { status: status })
        .andWhere(`orders.createdAt BETWEEN '${fromDate}' AND '${toDate}'`)
        .andWhere('orders."id" like :query', {
          query: `%${query?.toString()}%`
        })
        .skip(skip)
        .take(page)
        .getManyAndCount()
      return res.status(200).json({ orders, count })
    } else if (
      !isEmpty(fromDate) &&
      !isEmpty(toDate) &&
      status === Status.ALL
    ) {
      const [orders, count] = await getConnection()
        .getRepository(Order)
        .createQueryBuilder('orders')
        .leftJoinAndSelect('orders.outlet', 'outlet')
        .leftJoinAndSelect('orders.agent', 'agent')
        .leftJoinAndSelect('orders.invoice', 'invoice')
        .leftJoinAndSelect('orders.delivery', 'delivery')
        .where(`orders.createdAt BETWEEN '${fromDate}' AND '${toDate}'`)
        .andWhere('orders."id" like :query', {
          query: `%${query?.toString()}%`
        })
        .skip(skip)
        .take(page)
        .getManyAndCount()
      return res.status(200).json({ orders, count })
    } else if (isEmpty(fromDate) && isEmpty(toDate) && status !== Status.ALL) {
      const [orders, count] = await getConnection()
        .getRepository(Order)
        .createQueryBuilder('orders')
        .leftJoinAndSelect('orders.outlet', 'outlet')
        .leftJoinAndSelect('orders.agent', 'agent')
        .leftJoinAndSelect('orders.invoice', 'invoice')
        .leftJoinAndSelect('orders.delivery', 'delivery')
        .where('orders."status" = :status', { status: status })
        .andWhere('orders."id" like :query', {
          query: `%${query?.toString()}%`
        })
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
        .where('orders."id" like :query', {
          query: `%${query?.toString()}%`
        })
        .skip(skip)
        .take(page)
        .getManyAndCount()
      return res.status(200).json({ orders, count })
    }
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

router.get(
  '/orders/:id',
  authorization,
  async (req: Request, res: Response) => {
    const page = req.query.page !== undefined ? +req.query.page : 10
    const skip = req.query.skip !== undefined ? +req.query.skip : 0
    const id: string = req.params.id
    const type = req.query.type !== undefined ? req.query.type : 'agent'

    try {
      if (type === 'outlet') {
        const [orders, count] = await getConnection()
          .getRepository(Order)
          .createQueryBuilder('orders')
          .leftJoinAndSelect('orders.agent', 'agent')
          .leftJoinAndSelect('orders.invoice', 'invoice')
          .leftJoinAndSelect('orders.delivery', 'delivery')
          .where('orders."outletId" = :outletId', { outletId: id })
          .skip(skip)
          .take(page)
          .getManyAndCount()

        return res.status(200).json({ orders, count })
      } else {
        const [orders, count] = await getConnection()
          .getRepository(Order)
          .createQueryBuilder('orders')
          .leftJoinAndSelect('orders.outlet', 'outlet')
          .leftJoinAndSelect('orders.invoice', 'invoice')
          .leftJoinAndSelect('orders.delivery', 'delivery')
          .where('orders."agentId" = :agentId', { agentId: id })
          .skip(skip)
          .take(page)
          .getManyAndCount()

        return res.status(200).json({ orders, count })
      }
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

    try {
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
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    return res.sendStatus(200)
  }
)

router.post(
  '/orders/bulk',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Order__[] = req.body
    try {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Order)
        .values(inputs)
        .execute()

      return res.sendStatus(201)
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
  }
)

export { router as orders }
