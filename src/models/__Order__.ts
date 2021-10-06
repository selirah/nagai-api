import { __Item__ } from './__Item__'

export class __Order__ {
  id: string
  orderNumber: string
  items: __Item__[]
  orderTotal: number
  outletId: number
  agentId: number
  status: string
  comments: string
  createdAt: Date
  updatedAt: Date
}
