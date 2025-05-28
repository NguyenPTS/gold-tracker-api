import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateGoldDto } from './dto/create-gold.dto';
import { UpdateGoldDto } from './dto/update-gold.dto';
import { GoldPriceData, BTMCResponse } from './interfaces/gold-price.interface';
import { ConfigService } from '@nestjs/config';
import { map, catchError } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gold } from './entities/gold.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class GoldService {
  private readonly btmcApiUrl = 'http://api.btmc.vn/api/BTMCAPI/getpricebtmc';
  private readonly btmcApiKey = '3kd8ub1llcg9t45hnoh8hmn7t5kc2v';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Gold)
    private goldRepository: Repository<Gold>,
  ) {}

  create(createGoldDto: CreateGoldDto) {
    return 'This action adds a new gold';
  }

  findAll() {
    return `This action returns all gold`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gold`;
  }

  update(id: number, updateGoldDto: UpdateGoldDto) {
    return `This action updates a #${id} gold`;
  }

  remove(id: number) {
    return `This action removes a #${id} gold`;
  }

  private transformData(item: any, index: number): GoldPriceData {
    return {
      row: item['@row'],
      name: item[`@n_${item['@row']}`].split('(')[0].trim(),
      type: item[`@k_${item['@row']}`],
      purity: item[`@h_${item['@row']}`],
      buyPrice: parseInt(item[`@pb_${item['@row']}`]) || 0,
      sellPrice: parseInt(item[`@ps_${item['@row']}`]) || 0,
      timestamp: item[`@d_${item['@row']}`],
    };
  }

  async getLatestPrices(): Promise<GoldPriceData[]> {
    try {
      const { data } = await firstValueFrom<AxiosResponse<BTMCResponse>>(
        this.httpService.get<BTMCResponse>(`${this.btmcApiUrl}?key=${this.btmcApiKey}`)
      );

      // Get unique timestamps
      const timestamps = [...new Set(data.DataList.Data.map(item => item[`@d_${item['@row']}`]))];
      const latestTimestamp = timestamps[0];

      // Filter items with latest timestamp
      return data.DataList.Data
        .filter(item => item[`@d_${item['@row']}`] === latestTimestamp)
        .map((item, index) => this.transformData(item, index + 1));

    } catch (error) {
      console.error('Error fetching gold prices:', error);
      throw error;
    }
  }

  async getPriceHistory(): Promise<GoldPriceData[]> {
    try {
      const { data } = await firstValueFrom<AxiosResponse<BTMCResponse>>(
        this.httpService.get<BTMCResponse>(`${this.btmcApiUrl}?key=${this.btmcApiKey}`)
      );

      return data.DataList.Data.map((item, index) => this.transformData(item, index + 1));
    } catch (error) {
      console.error('Error fetching gold price history:', error);
      throw error;
    }
  }

  // Thêm method để lấy giá theo loại vàng
  async getPricesByType(type: string): Promise<GoldPriceData[]> {
    try {
      const allPrices = await this.getLatestPrices();
      return allPrices.filter(item => 
        item.name.toLowerCase().includes(type.toLowerCase())
      );
    } catch (error) {
      console.error(`Error fetching prices for type ${type}:`, error);
      throw error;
    }
  }

  async saveLatestPricesToDb() {
    const prices = await this.getLatestPrices();
    for (const price of prices) {
      // Check if already exists (type + createdAt)
      const exists = await this.goldRepository.findOne({
        where: { type: price.type, createdAt: new Date(price.timestamp) }
      });
      if (!exists) {
        await this.goldRepository.save({
          type: price.type,
          buy: price.buyPrice,
          sell: price.sellPrice,
          createdAt: new Date(price.timestamp)
        });
      }
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    await this.saveLatestPricesToDb();
    console.log('Đã lưu giá vàng mới vào DB');
  }
}
