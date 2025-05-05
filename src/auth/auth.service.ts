import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    // Tại đây bạn có thể:
    // 1. Kiểm tra xem user đã tồn tại trong database chưa
    // 2. Nếu chưa thì tạo user mới
    // 3. Tạo JWT token

    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}
