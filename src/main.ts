import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  
  // Enable cookie parser
  app.use(cookieParser());

  // Enable session support
  app.use(
    session({
      secret: process.env.JWT_SECRET || 'your_jwt_secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
    }),
  );
  
  // Enable CORS with credentials
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  console.log(`Configuring CORS for frontend URL: ${frontendUrl}`);
  
  app.enableCors({
    origin: [frontendUrl, 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With','x-api-key'],
    exposedHeaders: ['Set-Cookie', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Gold Tracker API')
    .setDescription('API documentation for Gold Tracker application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
