import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'johndoe', description: 'Username của người dùng' })
  username: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu của người dùng' })
  password: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email của người dùng' })
  email: string;
}
