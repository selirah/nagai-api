import { __Category__ } from './__Category__'
import { __Manufacturer__ } from './__Manufacturer__'
import { __Stock__ } from './__Stock__'

export class __Product__ {
  id: string
  productName: string
  categoryId: number
  manufacturerId: number
  avatar: string
  category: __Category__
  manufacturer: __Manufacturer__
  stock: __Stock__[]
  createdAt: Date
  updatedAt: Date
}
