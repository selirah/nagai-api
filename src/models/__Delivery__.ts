export class __Delivery__ {
  id: string
  orderId: string
  dispatchId: number
  isDelivered: boolean
  coordinates: {
    lat: number
    lng: number
  }
  deliveryDate: Date
  comments: string
  createdAt: Date
  updatedAt: Date
}
