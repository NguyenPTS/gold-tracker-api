import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { Asset } from "../../assets/entities/asset.entity";

@Entity()
export class User { 
    @ApiProperty({
        description: 'ID của người dùng',
        example: 1
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'Tên đăng nhập, phải là duy nhất',
        example: 'testuser',
        uniqueItems: true
    })
    @Column({unique: true})
    username: string;

    @ApiProperty({
        description: 'Mật khẩu đã được mã hóa (chỉ null với tài khoản Google)',
        example: '$2b$10$...',
        required: false
    })
    @Column({nullable: true})
    password: string;

    @ApiProperty({
        description: 'Email của người dùng, phải là duy nhất',
        example: 'test@example.com',
        uniqueItems: true
    })
    @Column({unique: true})
    email: string;

    @ApiProperty({
        description: 'Tên của người dùng',
        example: 'Test',
        required: false
    })
    @Column({nullable: true})
    firstName: string;

    @ApiProperty({
        description: 'Họ của người dùng',
        example: 'User',
        required: false
    })
    @Column({nullable: true})
    lastName: string;

    @ApiProperty({
        description: 'URL ảnh đại diện (chủ yếu từ Google)',
        example: 'https://lh3.googleusercontent.com/...',
        required: false
    })
    @Column({nullable: true})
    picture: string;

    @ApiProperty({
        description: 'Đánh dấu tài khoản được tạo qua Google',
        example: false,
        default: false
    })
    @Column({default: false})
    isGoogleUser: boolean;

    @ApiProperty({
        description: 'Danh sách tài sản của người dùng',
        type: () => [Asset]
    })
    @OneToMany(() => Asset, asset => asset.user)
    assets: Asset[];
}
