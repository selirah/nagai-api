import { __Category__ } from './__Category__';
import { __Manufacturer__ } from './__Manufacturer__';

export class __Product__ {
  productId: string;
  productName: string;
  categoryId: number;
  manufacturerId: number;
  category: __Category__;
  manufacturer: __Manufacturer__;
  createdAt: Date;
  updatedAt: Date;
}
