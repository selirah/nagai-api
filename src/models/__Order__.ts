import { __Item__ } from './__Item__';

export class __Order__ {
  orderId: string;
  items: __Item__;
  vat: number;
  discount: number;
  clientId: number;
  createdAt: Date;
  updatedAt: Date;
}
