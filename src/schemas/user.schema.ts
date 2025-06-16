import { Role } from 'src/role.enum';
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
import { Favorite } from './favorite';
import { Rating } from './rating.schema';
import { Store } from './store.schema';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', nullable: false })
  lastName: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  phone: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  images: string;

  @Column({ default: false, type: 'boolean' })
  isVerified: boolean;

  @Column({ default: Role.User, type: 'varchar' })
  roles: string;

  @OneToOne(() => Store, (store) => store.user)
  @JoinColumn()
  store: Store;

  @OneToMany(() => Rating, (ra) => ra.user)
  ratings: Rating[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @OneToMany(() => Favorite, (fav) => fav.user, { onDelete: 'CASCADE' })
  favorites: Favorite[];
}
