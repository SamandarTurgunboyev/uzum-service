import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.schema';
import { SubCategory } from './subCategory.schema';

@Entity()
export class subSubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ManyToOne(() => SubCategory, (sub) => sub.subSubCategories, {
    onDelete: 'CASCADE',
  })
  subCategory: SubCategory;

  @OneToMany(() => Product, (pro) => pro.category)
  product: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
