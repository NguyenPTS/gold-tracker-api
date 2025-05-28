import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GoldService } from './gold.service';
import { GoldController } from './gold.controller';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gold } from './entities/gold.entity';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    CacheModule.register({
      ttl: 60, // cache trong 60 giây
      max: 100, // tối đa 100 items trong cache
    }),
    TypeOrmModule.forFeature([Gold]),
  ],
  controllers: [GoldController],
  providers: [GoldService],
  exports: [GoldService, HttpModule]
})
export class GoldModule {}
