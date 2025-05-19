import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateAssetDto {
  @ApiProperty({ example: 'SJC', description: 'Loại vàng' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ example: 1.0, description: 'Số lượng vàng' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 5000000, description: 'Giá mua' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  buyPrice: number;

  @ApiProperty({ required: false, description: 'Ghi chú' })
  @IsString()
  note?: string;
}
