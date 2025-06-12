import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Store } from './store.schema';
import { subSubCategory } from './subSubCategory.schema';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'json', nullable: true })
  name_uz: string;

  @Column({ type: 'json', nullable: true })
  name_ru: string;

  @Column({ type: 'json', nullable: true })
  name_en: string;

  @Column({ type: 'json', nullable: true })
  description_uz: string;

  @Column({ type: 'json', nullable: true })
  description_ru: string;

  @Column({ type: 'json', nullable: true })
  description_en: string;

  @Column({ type: 'varchar', nullable: false })
  price: string;

  @Column({ default: false })
  disCount?: boolean;

  @Column({ type: 'varchar', nullable: true })
  disPrice?: string;

  @Column({ type: 'json', nullable: true })
  banner: any[];

  @Column({ type: 'json', nullable: true })
  media: any[];

  @ManyToOne(() => Store, (store) => store.products, { onDelete: 'CASCADE' })
  store: Store;

  @ManyToOne(() => subSubCategory, (sub) => sub.product, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  category: subSubCategory;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
