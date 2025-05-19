import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { GoldService } from './gold.service';
import { CreateGoldDto } from './dto/create-gold.dto';
import { UpdateGoldDto } from './dto/update-gold.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('gold')
@ApiBearerAuth()
@Controller('gold')
@UseInterceptors(CacheInterceptor)
export class GoldController {
  constructor(private readonly goldService: GoldService) {}

  @Post()
  create(@Body() createGoldDto: CreateGoldDto) {
    return this.goldService.create(createGoldDto);
  }

  @Get()
  findAll() {
    return this.goldService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goldService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoldDto: UpdateGoldDto) {
    return this.goldService.update(+id, updateGoldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goldService.remove(+id);
  }

  @Get('prices/latest')
  @ApiOperation({ summary: 'Get latest gold prices' })
  getLatestPrices() {
    return this.goldService.getLatestPrices();
  }

  @Get('prices/history')
  @ApiOperation({ summary: 'Get gold price history' })
  getPriceHistory() {
    return this.goldService.getPriceHistory();
  }

  @Get('prices/type/:type')
  @ApiOperation({ summary: 'Get gold prices by type' })
  @ApiParam({ name: 'type', description: 'Type of gold (e.g., SJC, DOJI)' })
  getPricesByType(@Param('type') type: string) {
    return this.goldService.getPricesByType(type);
  }
}
