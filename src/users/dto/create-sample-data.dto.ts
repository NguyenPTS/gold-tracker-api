import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateSampleDataDto {
  @ApiProperty({ 
    example: 'test@example.com',
    description: 'Email của người dùng, phải là email hợp lệ',
    format: 'email',
    uniqueItems: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: 'Test@123',
    description: 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số',
    minLength: 6,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    example: 'testuser',
    description: 'Tên đăng nhập, phải là duy nhất trong hệ thống',
    uniqueItems: true,
    minLength: 3
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ 
    example: 'Test',
    description: 'Tên của người dùng',
    required: false
  })
  @IsString()
  firstName: string;

  @ApiProperty({ 
    example: 'User',
    description: 'Họ của người dùng',
    required: false
  })
  @IsString()
  lastName: string;
} 