import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Category } from './Category';
import { Manufacturer } from './Manufacturer';
import { Inventory } from './Inventory';
import { InventoryTrail } from './InventoryTrail';

@Entity()
export class Product extends BaseEntity {
  @PrimaryColumn()
  productId!: string;

  @Column()
  productName: string;

  @Column()
  categoryId: number;

  @Column()
  manufacturerId: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.products)
  @JoinColumn({ name: 'manufacturerId' })
  manufacturer: Manufacturer;

  @OneToOne(() => Inventory, (inventory) => inventory.product)
  inventory: Inventory;

  @OneToMany(() => InventoryTrail, (trail) => trail.product)
  inventoryTrails: InventoryTrail[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
