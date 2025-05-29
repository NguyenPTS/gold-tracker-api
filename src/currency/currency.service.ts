import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CurrencyService {
  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getRate(currency: string): Promise<number> {
    const cacheKey = `rate_${currency}_VND`;
    let rate = await this.cacheManager.get<number>(cacheKey);
    if (rate === undefined || rate === null) {
      const url = `https://hexarate.paikama.co/api/rates/latest/${currency}?target=VND`;
      const response = await this.httpService.get(url).toPromise();
      rate = response?.data?.mid ?? 0;
      await this.cacheManager.set(cacheKey, rate, 60); // cache 60s
    }
    return rate ?? 0;
  }

  async getRates(currencies: string[]): Promise<{ currency: string; rate: number }[]> {
    const results = await Promise.all(
      currencies.map(async (currency) => ({
        currency,
        rate: await this.getRate(currency),
      }))
    );
    return results;
  }

  async convert(currency: string, amount: number): Promise<number> {
    const rate = await this.getRate(currency);
    return amount * rate;
  }
}
