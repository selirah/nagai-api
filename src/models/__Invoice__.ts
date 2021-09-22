import { __Tax__ } from './__Tax__'

export class __Invoice__ {
  id: string
  invoiceNumber: string
  orderId: string
  orderNumber: string
  taxes: __Tax__[]
  discount: number
  deliveryFee: number
  finalAmount: number
  createdAt: Date
  updatedAt: Date
}
