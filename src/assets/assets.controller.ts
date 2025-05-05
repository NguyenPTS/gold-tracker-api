import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { SellAssetDto } from './dto/sell-asset.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new asset' })
  create(@Body() createAssetDto: CreateAssetDto, @Req() req) {
    return this.assetsService.create(createAssetDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assets' })
  findAll(@Req() req) {
    return this.assetsService.findAll(req.user);
  }

  @Get('profit-loss')
  @ApiOperation({ summary: 'Get profit/loss analysis' })
  getProfitLoss(@Req() req) {
    return this.assetsService.getProfitLoss(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset by id' })
  findOne(@Param('id') id: string, @Req() req) {
    return this.assetsService.findOne(+id, req.user);
  }

  @Post(':id/sell')
  @ApiOperation({ summary: 'Sell asset' })
  sell(@Param('id') id: string, @Body() sellAssetDto: SellAssetDto, @Req() req) {
    return this.assetsService.sell(+id, sellAssetDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete asset' })
  remove(@Param('id') id: string, @Req() req) {
    return this.assetsService.remove(+id, req.user);
  }
}
