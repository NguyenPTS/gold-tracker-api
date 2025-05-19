import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './entities/asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { SellAssetDto } from './dto/sell-asset.dto';
import { User } from '../users/entities/user.entity';
import { GoldService } from '../gold/gold.service';

type AssetWithProfit = Asset & {
  currentPrice: number | null;
  profit: number | null;
};

type ProfitLossResult = {
  totalInvestment: number;
  totalCurrentValue: number;
  totalRealizedProfit: number;
  totalUnrealizedProfit: number;
  assets: AssetWithProfit[];
};

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
    private goldService: GoldService,
  ) {}

  async create(createAssetDto: CreateAssetDto, user: User) {
    const asset = this.assetRepository.create({
      ...createAssetDto,
      user,
    });
    return this.assetRepository.save(asset);
  }

  async findAll(user: User) {
    return this.assetRepository.find({
      where: { user: { id: user.id } },
      order: { buyDate: 'DESC' },
    });
  }

  async findOne(id: number, user: User) {
    const asset = await this.assetRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!asset) {
      throw new NotFoundException(`Asset #${id} not found`);
    }
    return asset;
  }

  async sell(id: number, sellAssetDto: SellAssetDto, user: User) {
    const asset = await this.findOne(id, user);
    
    if (asset.isSold) {
      throw new BadRequestException('Asset already sold');
    }

    asset.sellPrice = sellAssetDto.sellPrice;
    asset.isSold = true;
    asset.sellDate = new Date();

    return this.assetRepository.save(asset);
  }

  async getProfitLoss(user: User) {
    const assets = await this.assetRepository.find({
      where: { user: { id: user.id } },
    });

    const currentPrices = await this.goldService.getLatestPrices();

    const result: ProfitLossResult = {
      totalInvestment: 0,
      totalCurrentValue: 0,
      totalRealizedProfit: 0,
      totalUnrealizedProfit: 0,
      assets: [],
    };

    for (const asset of assets) {
      const currentPrice = currentPrices.find(p => p.name.includes(asset.type));
      const investment = asset.amount * asset.buyPrice;
      result.totalInvestment += investment;

      if (asset.isSold) {
        const realizedProfit = (asset.sellPrice - asset.buyPrice) * asset.amount;
        result.totalRealizedProfit += realizedProfit;
      } else if (currentPrice) {
        const currentValue = asset.amount * currentPrice.sellPrice;
        const unrealizedProfit = currentValue - investment;
        result.totalCurrentValue += currentValue;
        result.totalUnrealizedProfit += unrealizedProfit;
      }

      result.assets.push({
        ...asset,
        currentPrice: currentPrice?.sellPrice || null,
        profit: asset.isSold 
          ? (asset.sellPrice - asset.buyPrice) * asset.amount
          : currentPrice 
            ? (currentPrice.sellPrice - asset.buyPrice) * asset.amount
            : null,
      });
    }

    return result;
  }

  async remove(id: number, user: User) {
    const asset = await this.findOne(id, user);
    return this.assetRepository.remove(asset);
  }
}
