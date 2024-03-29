import { __Product__ } from './__Product__'
import { __StockTrail__ } from './__StockTrail__'
export class __Stock__ {
  id: string
  productId: string
  sku: string
  unit: string
  unitPrice: number
  quantityPurchased: number
  quantityInStock: number
  stockValue: number
  reorderLevel: number
  reorderQuantity: number
  reorderDate: Date
  product: __Product__
  stockTrails: __StockTrail__[]
  comments: string
  createdAt: Date
  updatedAt: Date
}
