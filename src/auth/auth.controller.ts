import { Controller, Get, Req, UseGuards, Res, HttpStatus, Post, Body, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  @Get('google')
  @ApiOperation({ summary: 'Google OAuth2 Login' })
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Google OAuth initiation
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth2 Callback' })
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    try {
      console.log('Google callback received. Processing login...');
      const result = await this.authService.googleLogin(req);
      console.log('Login successful, setting cookies...');
      
      const token = result.access_token;
      const userInfo = {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        picture: result.user.picture
      };

      const cookieDomain = this.configService.get('COOKIE_DOMAIN') || 'localhost';
      const isProduction = this.configService.get('NODE_ENV') === 'production';

      // Set access token cookie
      console.log('Setting access_token cookie');
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        domain: cookieDomain,
        path: '/',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      // Set user info cookie
      console.log('Setting user_info cookie');
      res.cookie('user_info', JSON.stringify(userInfo), {
        httpOnly: false,
        secure: isProduction,
        sameSite: 'lax',
        domain: cookieDomain,
        path: '/',
        maxAge: 24 * 60 * 60 * 1000
      });

      console.log('Cookies set successfully');
      console.log('Cookie headers:', res.getHeaders());

      // Redirect với token trong URL để đảm bảo
      const frontendUrl = this.configService.get('FRONTEND_URL') || 'https://giavang.trungthanhdev.com';
      const redirectUrl = `${frontendUrl}/auth-success?token=${token}`;
      console.log('Redirecting to:', redirectUrl);
      return res.redirect(302, redirectUrl);
    } catch (error) {
      console.error('Google auth error:', error);
      const frontendUrl = this.configService.get('FRONTEND_URL') || 'https://giavang.trungthanhdev.com';
      return res.redirect(302, `${frontendUrl}/auth-error`);
    }
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    const cookieDomain = this.configService.get('COOKIE_DOMAIN') ;
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'https://giavang.trungthanhdev.com';
    
    // Clear cookies
    res.clearCookie('access_token', {
      domain: cookieDomain,
      path: '/',
    });
    
    res.clearCookie('user_info', {
      domain: cookieDomain,
      path: '/',
    });
    
    // Redirect to home page
    return res.redirect(302, frontendUrl);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Body() loginDto: LoginDto) {
    console.log('Received login request:', loginDto);
    return this.authService.login(loginDto);
  }

  @Post('create-test-account')
  @ApiOperation({ summary: 'Create test account' })
  async createTestAccount() {
    return this.usersService.createTestAccount();
  }
}
