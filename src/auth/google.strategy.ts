import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get('GOOGLE_CLIENT_SECRET');
    const callbackURL = configService.get('GOOGLE_CALLBACK_URL');
    
    console.log('Initializing Google Strategy with:', {
      clientID,
      clientSecret: clientSecret ? '***' : undefined,
      callbackURL,
    });

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    console.log('Google Strategy validate called with profile:', {
      id: profile.id,
      displayName: profile.displayName,
      emails: profile.emails,
    });

    const { name, emails, photos } = profile;
    return {
      email: emails[0].value,
      firstName: name?.givenName || profile.displayName.split(' ')[0],
      lastName: name?.familyName || profile.displayName.split(' ').slice(1).join(' '),
      picture: photos?.[0]?.value || null,
      accessToken,
    };
  }
}
