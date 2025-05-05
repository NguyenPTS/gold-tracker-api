import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Asset } from "../../assets/entities/asset.entity";

@Entity()
export class User { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column()
    password: string;

    @Column({unique: true})
    email: string;

    @OneToMany(() => Asset, asset => asset.user)
    assets: Asset[];
    
    
}
