import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.schema';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  price: string;

  @Column({ type: 'bool', default: false })
  disCount?: boolean;

  @Column({ type: 'varchar', nullable: true })
  disPrice?: string;

  @Column({ type: 'json', nullable: true })
  banner: any[];

  @Column({ type: 'json', nullable: true })
  media: any[];

  @ManyToOne(() => User, (user) => user.products)
  user: User;
}
