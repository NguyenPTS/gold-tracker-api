import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private usersService: UsersService,
  ) {}

  async googleLogin(req) {
    console.log('Processing Google login request');
    if (!req.user) {
      console.error('No user data from Google');
      throw new UnauthorizedException('No user from Google');
    }

    try {
      console.log('Looking for existing user with email:', req.user.email);
      // Tìm user trong database
      let user = await this.userRepository.findOne({
        where: { email: req.user.email }
      });
      //
      // Nếu user chưa tồn tại, tạo mới
      if (!user) {
        console.log('Creating new user from Google data');
        user = this.userRepository.create({
          email: req.user.email,
          username: req.user.email.split('@')[0],
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          picture: req.user.picture,
          isGoogleUser: true
        });
        await this.userRepository.save(user);
        console.log('New user created:', user.id);
      } else {
        console.log('Found existing user:', user.id);
      }

      // Tạo JWT token
      const payload = {
        sub: user.id,
        email: user.email,
        username: user.username
      };

      const token = this.jwtService.sign(payload);
      console.log('JWT token generated');

      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          picture: user.picture
        }
      };
    } catch (error) {
      console.error('Error in googleLogin:', error);
      throw new UnauthorizedException('Failed to process Google login');
    }
  }

  // Thêm method để validate JWT token
  async validateUser(payload: any) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub }
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async login(loginDto: LoginDto) {
    if (!loginDto.email || !loginDto.password) {
      throw new UnauthorizedException('Email và mật khẩu không được để trống');
    }

    console.log('Login attempt with:', { email: loginDto.email });
    
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      console.log('User not found with email:', loginDto.email);
      throw new UnauthorizedException('Email không tồn tại');
    }

    if (user.isGoogleUser) {
      throw new UnauthorizedException('Tài khoản này sử dụng đăng nhập bằng Google');
    }

    console.log('Found user:', { 
      id: user.id, 
      email: user.email,
      hasPassword: !!user.password 
    });

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      loginDto.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email đã được sử dụng');
    }
    // Tạo user mới
    const user = await this.usersService.create({
      email: registerDto.email,
      password: registerDto.password,
      username: registerDto.email.split('@')[0],
    });
    // Tạo JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
