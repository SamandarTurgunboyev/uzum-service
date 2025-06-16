import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.schema';
import { User } from './user.schema';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  rating: number;

  @ManyToOne(() => User, (user) => user.ratings, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;

  @ManyToOne(() => Product, (product) => product.ratings, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;
}
