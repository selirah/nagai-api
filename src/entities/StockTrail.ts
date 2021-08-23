import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm'
import { Product } from './Product'
import { User } from './User'
import { Stock } from './Stock'

@Entity()
export class StockTrail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  stockId: string

  @Column()
  productId: string

  @Column()
  sku: string

  @Column()
  unit: string

  @Column('decimal', { precision: 15, scale: 2 })
  unitPrice: number

  @Column()
  quantityPurchased: number

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number

  @Column()
  quantityInStock: number

  @Column('decimal', { precision: 15, scale: 2 })
  stockValue: number

  @Column()
  reorderLevel: number

  @Column()
  reorderQuantity: number

  @Column()
  reorderDate: Date

  @Column()
  userId: number

  @ManyToOne(() => Product, (product) => product.stockTrails)
  @JoinColumn({ name: 'productId' })
  product: Product

  @ManyToOne(() => User, (user) => user.stockTrails)
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => Stock, (stock) => stock.stockTrails)
  @JoinColumn({ name: 'stockId' })
  stock: Stock

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
