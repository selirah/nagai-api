import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Product } from './Product';
import { User } from './User';

@Entity()
export class InventoryTrail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: string;

  @Column()
  unit: string;

  @Column({ type: 'text' })
  description: string;

  @Column('decimal', { precision: 5, scale: 2 })
  unitPrice: number;

  @Column()
  quantity: number;

  @Column()
  reorderLevel: number;

  @Column()
  reorderQuantity: number;

  @Column()
  reorderDate: Date;

  @Column()
  userId: number;

  @ManyToOne(() => Product, (product) => product.inventoryTrails)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => User, (user) => user.inventoryTrails)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
