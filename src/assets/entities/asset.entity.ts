import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Asset {
  @ApiProperty({
    description: 'ID của tài sản',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Người dùng sở hữu tài sản',
    type: () => User
  })
  @ManyToOne(() => User, user => user.assets, { eager: true })
  user: User;

  @ApiProperty({
    description: 'Loại vàng (VD: SJC, DOJI)',
    example: 'SJC'
  })
  @Column()
  type: string; // VD: SJC, DOJI

  @ApiProperty({
    description: 'Số lượng vàng (đơn vị lượng)',
    example: 1.0
  })
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number; // số lượng vàng

  @ApiProperty({
    description: 'Giá mua (đơn vị: VND)',
    example: 5000000
  })
  @Column('decimal', { precision: 20, scale: 2 })
  buyPrice: number; // giá mua

  @ApiProperty({
    description: 'Giá bán (đơn vị: VND), chỉ có giá trị khi tài sản đã được bán',
    example: 5500000,
    nullable: true
  })
  @Column('decimal', { precision: 20, scale: 2, nullable: true })
  sellPrice: number; // giá bán (nếu đã bán)

  @ApiProperty({
    description: 'Trạng thái đã bán hay chưa',
    example: false,
    default: false
  })
  @Column({ default: false })
  isSold: boolean; // trạng thái đã bán hay chưa

  @ApiProperty({
    description: 'Ngày mua tài sản',
    example: '2023-10-15T08:15:30.000Z'
  })
  @CreateDateColumn()
  buyDate: Date; // ngày mua

  @ApiProperty({
    description: 'Ngày bán tài sản, chỉ có giá trị khi tài sản đã được bán',
    example: '2023-11-20T09:45:12.000Z',
    nullable: true
  })
  @Column({ type: 'timestamp', nullable: true })
  sellDate: Date; // ngày bán (nếu đã bán)

  @ApiProperty({
    description: 'Ghi chú về tài sản',
    example: 'Mua vàng đầu tư dài hạn',
    nullable: true
  })
  @Column({ type: 'text', nullable: true })
  note: string; // ghi chú
}