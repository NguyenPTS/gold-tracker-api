import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class SellAssetDto {
  @ApiProperty({ example: 5200000, description: 'Giá bán' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  sellPrice: number;
} 