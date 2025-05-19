import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Try to get token from different sources
    const token = 
      req.cookies?.access_token || 
      req.query?.token || 
      req.headers?.authorization?.replace('Bearer ', '');
    
    if (token) {
      try {
        const decoded = this.jwtService.verify(token);
        req['user'] = decoded;
        
        // If token was in query params, set it as a cookie
        if (req.query.token && !req.cookies?.access_token) {
          res.cookie('access_token', token, {
            httpOnly: true,
            secure: false, // Set to true in production
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
          });
        }
      } catch (error) {
        console.error('Invalid token:', error.message);
        // Token không hợp lệ, xóa cookie
        res.clearCookie('access_token');
        res.clearCookie('user');
      }
    }
    
    next();
  }
} 