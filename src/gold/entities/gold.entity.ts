import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Gold {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
  type: string; // VD: SJC, DOJI

  @Column('decimal', { precision: 10, scale: 2 })
  buy: number;

  @Column('decimal', { precision: 10, scale: 2 })
  sell: number;

  @CreateDateColumn()
  createdAt: Date;
}
