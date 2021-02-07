import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Unit extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  unit: string;

  @Column()
  description: string;
}
