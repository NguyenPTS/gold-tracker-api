import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Loại trừ các route public không cần API Key
    const publicPaths = [
      '/auth/google',
      '/auth/google/callback',
      '/auth/create-test-account',
    ];
    if (publicPaths.includes(req.path)) {
      return next();
    }

    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    const validApiKey = process.env.API_KEY;

    if (apiKey !== validApiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }
    next();
  }
} 