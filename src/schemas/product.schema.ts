import { slugifyWithApostrophe } from 'src/utilits/slug.utilits';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Brand } from './brand.schema';
import { Rating } from './rating.schema';
import { Store } from './store.schema';
import { subSubCategory } from './subSubCategory.schema';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name_uz: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  slug: string;

  @Column({ type: 'varchar', nullable: false })
  name_ru: string;

  @Column({ type: 'varchar', nullable: false })
  name_en: string;

  @Column({ type: 'varchar', nullable: false })
  description_uz: string;

  @Column({ type: 'varchar', nullable: false })
  description_ru: string;

  @Column({ type: 'varchar', nullable: false })
  description_en: string;

  @Column({ type: 'varchar', nullable: false })
  price: string;

  @Column({ default: false })
  disCount?: boolean;

  @Column({ type: 'varchar', nullable: true })
  disPrice?: string;

  @Column({ type: 'json', nullable: false })
  banner: string[];

  @Column({ type: 'json', nullable: false })
  media: string[];

  @ManyToOne(() => Store, (store) => store.products, { onDelete: 'CASCADE' })
  store: Store;

  @ManyToOne(() => subSubCategory, (sub) => sub.product, {
    onDelete: 'SET NULL',
    nullable: false,
  })
  category: subSubCategory;

  @ManyToOne(() => Brand, (br) => br.product, { nullable: false })
  brand: Brand;

  @OneToMany(() => Rating, (ra) => ra.product)
  ratings: Rating;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @BeforeInsert()
  generateSlug() {
    const baseSlug = slugifyWithApostrophe(this.name_uz || 'product');
    this.slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
  }
}
