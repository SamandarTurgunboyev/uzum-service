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

  @Column({ type: 'varchar', nullable: false, unique: true })
  name: string;

  @ManyToOne(() => SubCategory, (sub) => sub.subSubCategories, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  subCategory: SubCategory;

  @Column({ type: 'varchar', nullable: true, unique: true })
  slug: string;

  @OneToMany(() => Product, (pro) => pro.category)
  product: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
