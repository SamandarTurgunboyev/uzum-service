import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubCategory } from './subCategory.schema';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  name_uz: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  name_ru: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  name_en: string;

  @OneToMany(() => SubCategory, (sub) => sub.category, { onDelete: 'CASCADE' })
  subCategories: SubCategory[];

  @Column({ type: 'varchar', nullable: true, unique: true })
  slug: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
