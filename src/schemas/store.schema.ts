import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.schema';
import { User } from './user.schema';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar', unique: true })
  store_name: string;

  @Column({ nullable: false, type: 'varchar' })
  addres: string;

  @Column({ nullable: false, type: 'varchar' })
  longitude: string;

  @Column({ nullable: false, type: 'varchar' })
  latitude: string;

  @Column({ nullable: false, type: 'varchar' })
  banner: string;

  @OneToOne(() => User, (user) => user.store)
  @JoinColumn()
  user: User;

  @OneToMany(() => Product, (product) => product)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}
