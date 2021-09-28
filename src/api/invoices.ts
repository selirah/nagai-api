import { router /*, sendEmail*/ } from '../utils'
import { Request, Response } from 'express'
import { Invoice } from '../entities/Invoice'
import { authorization } from '../middleware/auth'
import { getConnection, Brackets } from 'typeorm'
import { validateInvoice } from '../validations'
import { __Invoice__ } from '../models/__Invoice__'
import { isEmpty } from '../validations/isEmpty'

router.post('/invoices', authorization, async (req: Request, res: Response) => {
  const inputs: __Invoice__ = req.body
  const errors = validateInvoice(inputs)

  if (errors) {
    return res.status(400).json({ errors })
  }

  try {
    const queryResult = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Invoice)
      .values({
        id: inputs.invoiceNumber,
        orderId: inputs.orderNumber,
        taxes: inputs.taxes,
        discount: inputs.discount,
        deliveryFee: inputs.deliveryFee,
        finalAmount: inputs.finalAmount
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
  '/invoices/:id',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Invoice__ = req.body
    const errors = validateInvoice(inputs)
    const id: string = req.params.id

    if (errors) {
      return res.status(400).json({ errors })
    }

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .update(Invoice)
        .set({
          id: inputs.invoiceNumber,
          orderId: inputs.orderNumber,
          taxes: inputs.taxes,
          discount: inputs.discount,
          deliveryFee: inputs.deliveryFee,
          finalAmount: inputs.finalAmount
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

router.get('/invoices', authorization, async (req: Request, res: Response) => {
  const page = req.query.page !== undefined ? +req.query.page : 10
  const skip = req.query.skip !== undefined ? +req.query.skip : 0
  const query = req.query.query
  const fromDate = req.query.fromDate
  const toDate = req.query.toDate

  try {
    if (!isEmpty(fromDate) && !isEmpty(toDate)) {
      const [invoices, count] = await getConnection()
        .getRepository(Invoice)
        .createQueryBuilder('invoices')
        .leftJoinAndSelect('invoices.order', 'order')
        .where(`invoices.createdAt BETWEEN '${fromDate}' AND '${toDate}'`)
        .andWhere(
          new Brackets((sqb) => {
            sqb.where('invoices."invoiceNumber" like :query', {
              query: `%${query?.toString()}%`
            })
            sqb.orWhere('invoices."orderNumber" like :query', {
              query: `%${query?.toString()}%`
            })
          })
        )
        .skip(skip)
        .take(page)
        .getManyAndCount()
      return res.status(200).json({ invoices, count })
    } else {
      const [invoices, count] = await getConnection()
        .getRepository(Invoice)
        .createQueryBuilder('invoices')
        .leftJoinAndSelect('invoices.order', 'order')
        .where('invoices."invoiceNumber" like :query', {
          query: `%${query?.toString()}%`
        })
        .orWhere('invoices."orderNumber" like :query', {
          query: `%${query?.toString()}%`
        })
        .skip(skip)
        .take(page)
        .getManyAndCount()
      return res.status(200).json({ invoices, count })
    }
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

router.delete(
  '/invoices/:id',
  authorization,
  async (req: Request, res: Response) => {
    const id: string = req.params.id

    try {
      const queryResult = await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Invoice)
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
  '/invoices/bulk',
  authorization,
  async (req: Request, res: Response) => {
    const inputs: __Invoice__[] = req.body
    try {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Invoice)
        .values(inputs)
        .execute()
      return res.sendStatus(201)
    } catch (err) {
      console.log(err)
      return res.sendStatus(500)
    }
  }
)

export { router as invoices }
