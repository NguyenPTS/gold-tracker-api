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

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  sellPrice: number; // giá bán (nếu đã bán)

  @Column({ default: false })
  isSold: boolean; // trạng thái đã bán hay chưa

  @CreateDateColumn()
  buyDate: Date; // ngày mua

  @Column({ type: 'timestamp', nullable: true })
  sellDate: Date; // ngày bán (nếu đã bán)

  @Column({ type: 'text', nullable: true })
  note: string; // ghi chú
}