import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Product } from './Product';

@Entity()
export class Inventory extends BaseEntity {
  @PrimaryColumn()
  inventoryId: string;

  @Column({ unique: true })
  productId: string;

  @Column()
  unit: string;

  @Column({ type: 'text' })
  description: string;

  @Column('decimal', { precision: 5, scale: 2 })
  unitPrice: number;

  @Column({ default: 0 })
  quantityPurchased: number;

  @Column()
  quantityInStock: number;

  @Column()
  reorderLevel: number;

  @Column()
  reorderQuantity: number;

  @Column()
  reorderDate: Date;

  @OneToOne(() => Product, (product) => product.inventory)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
