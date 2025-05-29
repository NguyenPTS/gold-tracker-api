import { Controller, Get, Query } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('convert')
  async convert(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('amount') amount: number,
  ) {
    const result = await this.currencyService.convert(from, to, Number(amount));
    return { from, to, amount, result };
  }

  @Get('rates')
  async getRates(@Query('currencies') currencies?: string) {
    const defaultCurrencies = ['USD', 'EUR', 'JPY', 'GBP', 'CNY', 'KRW', 'THB', 'SGD'];
    const currencyList = currencies ? currencies.split(',').map(c => c.trim().toUpperCase()) : defaultCurrencies;
    const rates = await this.currencyService.getRates(currencyList);
    return { base: 'VND', rates };
  }

  @Get('rates/usd')
  async getRatesToUSD(@Query('currencies') currencies?: string) {
    const defaultCurrencies = ['EUR', 'JPY', 'GBP', 'CNY', 'KRW', 'THB', 'SGD'];
    const currencyList = currencies ? currencies.split(',').map(c => c.trim().toUpperCase()) : defaultCurrencies;
    const rates = await this.currencyService.getRates(currencyList);
    return { base: 'USD', rates };
  }
}
