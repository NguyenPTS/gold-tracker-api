import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GoldModule } from './gold/gold.module';
import { AssetsModule } from './assets/assets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'yourpassword',
      database: 'gold_tracker',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // CHỈ DÙNG TRONG DEV
    }),
    UsersModule, 
    GoldModule, 
    AssetsModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}