import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  OneToMany
} from 'typeorm'
import { Product } from './Product'
import { StockTrail } from './StockTrail'

@Entity()
export class Stock extends BaseEntity {
  @PrimaryColumn()
  id: string

  @Column()
  productId: string

  @Column({ unique: true })
  sku: string

  @Column()
  unit: string

  @Column('decimal', { precision: 5, scale: 2 }) // price of single
  unitPrice: number

  @Column()
  quantityPurchased: number

  @Column() // total quantity (ones purchased + ones already there)
  quantityInStock: number

  @Column('decimal', { precision: 5, scale: 2 }) // total amount (unit price * quantity in stock)
  stockValue: number

  @Column() // level to buy new stock
  reorderLevel: number

  @Column() // quantity to buy
  reorderQuantity: number

  @Column()
  reorderDate: Date

  @Column({ type: 'text', nullable: true })
  comments: string

  @OneToOne(() => Product, (product) => product.stock)
  @JoinColumn({ name: 'productId' })
  product: Product

  @OneToMany(() => StockTrail, (stockTrails) => stockTrails.stock)
  stockTrails: StockTrail[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
