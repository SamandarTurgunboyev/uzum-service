import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar' })
  otp: string;

  @CreateDateColumn()
  createdAt: Date;
}
