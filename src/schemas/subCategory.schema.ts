import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.schema';
import { subSubCategory } from './subSubCategory.schema';

@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  name_uz: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  name_ru: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  name_en: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  slug: string;

  @ManyToOne(() => Category, (category) => category.subCategories, {
    nullable: false,
  })
  category: Category;

  @OneToMany(() => subSubCategory, (sub) => sub.subCategory, {
    onDelete: 'CASCADE',
  })
  subSubCategories: subSubCategory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
