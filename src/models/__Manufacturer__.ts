import { __Product__ } from './__Product__'

export class __Manufacturer__ {
  id: number
  name: string
  email: string
  phone: string
  coordinates: {
    lat: number
    lng: number
  }
  location: string
  logo: string
  products: __Product__[]
  createdAt: Date
  updatedAt: Date
}
