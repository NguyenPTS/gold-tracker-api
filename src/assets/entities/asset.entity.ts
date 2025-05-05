import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.assets, { eager: true })
  user: User;

  @Column()
  type: string; // VD: SJC, DOJI

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number; // số lượng vàng

  @Column('decimal', { precision: 10, scale: 2 })
  buyPrice: number; // giá mua

  @CreateDateColumn()
  createdAt: Date;
}