import { router } from '../utils'
import { Request, Response } from 'express'
import { authorization } from '../middleware/auth'
import { getManager } from 'typeorm'
import { isEmpty } from '../validations/isEmpty'

router.get(
  '/statistics/orders',
  authorization,
  async (req: Request, res: Response) => {
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate

    if (!isEmpty(fromDate) && !isEmpty(toDate)) {
      const query = await getManager().query(
        'SELECT COUNT("order"."id"), "order".status FROM "order" WHERE "order"."createdAt" BETWEEN $1 AND $2 GROUP BY "order".status',
        [fromDate, toDate]
      )
      return res.status(200).json(query)
    } else {
      const query = await getManager().query(
        'SELECT COUNT("order"."id"), "order".status FROM "order" GROUP BY "order".status'
      )

      return res.status(200).json(query)
    }
  }
)

router.get(
  '/statistics/deliveries',
  authorization,
  async (req: Request, res: Response) => {
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate
    if (!isEmpty(fromDate) && !isEmpty(toDate)) {
      const query = await getManager().query(
        'SELECT COUNT("delivery"."id"), "delivery"."isDelivered" AS "delivered" FROM "delivery" WHERE "delivery"."createdAt" BETWEEN $1 AND $2 GROUP BY "delivery"."isDelivered"',
        [fromDate, toDate]
      )
      return res.status(200).json(query)
    } else {
      const query = await getManager().query(
        'SELECT COUNT("delivery"."id"), "delivery"."isDelivered" AS "delivered" FROM "delivery" GROUP BY "delivery"."isDelivered"'
      )
      return res.status(200).json(query)
    }
  }
)

router.get(
  '/statistics/sales',
  authorization,
  async (req: Request, res: Response) => {
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate

    if (!isEmpty(fromDate) && !isEmpty(toDate)) {
      const query = await getManager().query(
        'SELECT SUM("sale"."amount") AS "Total Amount", SUM("sale"."amountPaid") AS "Amount Paid", SUM("sale"."amountLeft") AS "Amount Left" FROM "sale" WHERE "sale"."createdAt" BETWEEN $1 AND $2',
        [fromDate, toDate]
      )
      return res.status(200).json(query)
    } else {
      const query = await getManager().query(
        'SELECT SUM("sale"."amount") AS "Total Amount", SUM("sale"."amountPaid") AS "Amount Paid", SUM("sale"."amountLeft") AS "Amount Left" FROM "sale"'
      )

      return res.status(200).json(query)
    }
  }
)

router.get(
  '/statistics/payments',
  authorization,
  async (req: Request, res: Response) => {
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate

    if (!isEmpty(fromDate) && !isEmpty(toDate)) {
      const query = await getManager().query(
        'SELECT SUM("payment"."amount") AS "Total Payment", "payment"."saleId" AS "Sale ID" FROM "payment" WHERE "payment"."createdAt" BETWEEN $1 AND $2 GROUP BY "payment"."saleId"',
        [fromDate, toDate]
      )
      return res.status(200).json(query)
    } else {
      const query = await getManager().query(
        'SELECT SUM("payment"."amount") AS "Total Payment", "payment"."saleId" AS "Sale ID" FROM "payment" GROUP BY "payment"."saleId"'
      )

      return res.status(200).json(query)
    }
  }
)

router.get(
  '/statistics/products',
  authorization,
  async (req: Request, res: Response) => {
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate

    if (!isEmpty(fromDate) && !isEmpty(toDate)) {
      const query = await getManager().query(
        'SELECT COUNT("product"."id") AS "Product Count", "category"."category" AS "Category" FROM "product" JOIN "category" ON ("category"."id" = "product"."categoryId") WHERE "product"."createdAt" BETWEEN $1 AND $2 GROUP BY "category"."category"',
        [fromDate, toDate]
      )
      return res.status(200).json(query)
    } else {
      const query = await getManager().query(
        'SELECT COUNT("product"."id") AS "Product Count", "category"."category" AS "Category" FROM "product" JOIN "category" ON ("category"."id" = "product"."categoryId") GROUP BY "category"."category"'
      )

      return res.status(200).json(query)
    }
  }
)

router.get(
  '/statistics/stock',
  authorization,
  async (req: Request, res: Response) => {
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate

    if (!isEmpty(fromDate) && !isEmpty(toDate)) {
      const query = await getManager().query(
        'SELECT SUM("stock"."quantityInStock") AS "Stock Quantity", SUM("stock"."stockValue") AS "Stock Value", SUM("stock"."reorderQuantity") AS "Reorder Quantity", "stock"."productId" AS "Product ID" FROM "stock"  WHERE "stock"."createdAt" BETWEEN $1 AND $2 GROUP BY "stock"."productId"',
        [fromDate, toDate]
      )
      return res.status(200).json(query)
    } else {
      const query = await getManager().query(
        'SELECT SUM("stock"."quantityInStock") AS "Stock Quantity", SUM("stock"."stockValue") AS "Stock Value", SUM("stock"."reorderQuantity") AS "Reorder Quantity", "stock"."productId" AS "Product ID" FROM "stock" GROUP BY "stock"."productId"'
      )
      return res.status(200).json(query)
    }
  }
)

router.get(
  '/statistics/invoices',
  authorization,
  async (req: Request, res: Response) => {
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate

    if (!isEmpty(fromDate) && !isEmpty(toDate)) {
      const query = await getManager().query(
        'SELECT "invoice"."finalAmount" AS "Total Amount", "invoice"."orderId" AS "Order ID" FROM "invoice"  WHERE "invoice"."createdAt" BETWEEN $1 AND $2',
        [fromDate, toDate]
      )
      return res.status(200).json(query)
    } else {
      const query = await getManager().query(
        'SELECT "invoice"."finalAmount" AS "Total Amount", "invoice"."orderId" AS "Order ID" FROM "invoice"'
      )
      return res.status(200).json(query)
    }
  }
)

router.get(
  '/statistics/outlets',
  authorization,
  async (req: Request, res: Response) => {
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate

    if (!isEmpty(fromDate) && !isEmpty(toDate)) {
      const query = await getManager().query(
        'SELECT COUNT("outlet"."id") AS "Total Outlets", "outlet".region AS "Region" FROM "outlet" WHERE "outlet"."createdAt" BETWEEN $1 AND $2 GROUP BY "outlet".region',
        [fromDate, toDate]
      )
      return res.status(200).json(query)
    } else {
      const query = await getManager().query(
        'SELECT COUNT("outlet"."id") AS "Total Outlets", "outlet".region AS "Region" FROM "outlet" GROUP BY "outlet".region'
      )

      return res.status(200).json(query)
    }
  }
)

router.get(
  '/statistics/manufacturers',
  authorization,
  async (req: Request, res: Response) => {
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate

    if (!isEmpty(fromDate) && !isEmpty(toDate)) {
      const query = await getManager().query(
        'SELECT COUNT("product"."id") AS "Product Count", "manufacturer"."name" AS "Manufacturer" FROM "manufacturer" JOIN "product" ON ("product"."manufacturerId" = "manufacturer"."id") WHERE "manufacturer"."createdAt" BETWEEN $1 AND $2 GROUP BY "manufacturer"."name"',
        [fromDate, toDate]
      )
      return res.status(200).json(query)
    } else {
      const query = await getManager().query(
        'SELECT COUNT("product"."id") AS "Product Count", "manufacturer"."name" AS "Manufacturer" FROM "manufacturer" JOIN "product" ON ("product"."manufacturerId" = "manufacturer"."id") GROUP BY "manufacturer"."name"'
      )

      return res.status(200).json(query)
    }
  }
)

router.get(
  '/statistics/territories',
  authorization,
  async (req: Request, res: Response) => {
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate

    if (!isEmpty(fromDate) && !isEmpty(toDate)) {
      const query = await getManager().query(
        'SELECT COUNT("territory"."id") AS "Total Territories", "region".region AS "Region" FROM "territory" JOIN "region" ON ("region"."id" = "territory"."regionId") WHERE "territory"."createdAt" BETWEEN $1 AND $2 GROUP BY "region".region',
        [fromDate, toDate]
      )
      return res.status(200).json(query)
    } else {
      const query = await getManager().query(
        'SELECT COUNT("territory"."id") AS "Total Territories", "region".region AS "Region" FROM "territory" JOIN "region" ON ("region"."id" = "territory"."regionId") GROUP BY "region".region'
      )

      return res.status(200).json(query)
    }
  }
)

export { router as statistics }
