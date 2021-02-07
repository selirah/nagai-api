import { __Product__ } from './__Product__';

export class __Manufacturer__ {
  manufacturerId: number;
  name: string;
  email: string;
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  location: string;
  cityId: number;
  logo: string;
  product: __Product__[];
  createdAt: Date;
  updatedAt: Date;
}
