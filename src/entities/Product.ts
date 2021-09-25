import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany
} from 'typeorm'
import { Category } from './Category'
import { Manufacturer } from './Manufacturer'
import { Stock } from './Stock'
import { StockTrail } from './StockTrail'

@Entity()
export class Product extends BaseEntity {
  @PrimaryColumn()
  id!: string

  @Column()
  productName: string

  @Column()
  categoryId: number

  @Column()
  manufacturerId: number

  @Column({ nullable: true })
  avatar: string

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.products)
  @JoinColumn({ name: 'manufacturerId' })
  manufacturer: Manufacturer

  @OneToMany(() => Stock, (stock) => stock.product)
  stock: Stock[]

  @OneToMany(() => StockTrail, (trail) => trail.product)
  stockTrails: StockTrail[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
