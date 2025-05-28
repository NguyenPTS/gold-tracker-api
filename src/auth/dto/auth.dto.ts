import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Test@123' })
  @IsString()
  @IsNotEmpty()
  password: string;
} 

export class RegisterDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Test@123' })
  @IsString()
  @IsNotEmpty()
  password: string;
  
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  username : string;
}