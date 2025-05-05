import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Asset } from "../../assets/entities/asset.entity";

@Entity()
export class User { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column({nullable: true}) // Password có thể null cho Google users
    password: string;

    @Column({unique: true})
    email: string;

    @Column({nullable: true})
    firstName: string;

    @Column({nullable: true})
    lastName: string;

    @Column({nullable: true})
    picture: string;

    @Column({default: false})
    isGoogleUser: boolean;

    @OneToMany(() => Asset, asset => asset.user)
    assets: Asset[];
    
    
}
