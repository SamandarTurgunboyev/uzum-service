import { Role } from 'src/role.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.schema';

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

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
