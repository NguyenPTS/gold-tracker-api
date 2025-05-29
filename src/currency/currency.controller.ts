import { Controller, Get, Query } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('convert')
  async convert(
    @Query('from') from: string,
    @Query('amount') amount: number,
  ) {
    const result = await this.currencyService.convert(from, Number(amount));
    return { from, amount, to: 'VND', result };
  }

  @Get('rates')
  async getRates(@Query('currencies') currencies?: string) {
    const defaultCurrencies = ['USD', 'EUR', 'JPY', 'GBP', 'CNY', 'KRW', 'THB', 'SGD'];
    const currencyList = currencies ? currencies.split(',').map(c => c.trim().toUpperCase()) : defaultCurrencies;
    const rates = await this.currencyService.getRates(currencyList);
    return { base: 'VND', rates };
  }
}
