// import { Inject, Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Profile, Strategy } from 'passport-google-oauth20';
// import { AuthService } from '../auth.service';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     @Inject('AUTH_SERVICE') private readonly authService: AuthService,
//   ) {
//     super({
//       clientID:
//         '923050935039-77k9jvk0k34r9prrsmnmkvd01ft7mdil.apps.googleusercontent.com',
//       clientSecret: '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',
//       callbackURL: 'http://localhost:3001/auth/google/redirect',
//       scope: ['profile', 'email'],
//     });
//   }

//   async validate(accessToken: string, refreshToken: string, profile: Profile) {
//     console.log(accessToken);
//     console.log(refreshToken);
//     console.log(profile);
//     const user = await this.authService.validateUser({
//       email: profile.emails[0].value,
//       displayName: profile.displayName,
//     });
//     console.log('Validate');
//     console.log(user);
//     return user || null;
//   }
// }
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import Auth from '../entity/auth.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
  ) {
    super({
      clientID: configService.get('CLIENT_ID'),
      clientSecret: configService.get('CLIENT_SECRET'),
      callbackURL: configService.get('CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log(_accessToken);
    const { id, name, emails, photos } = profile;

    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
    };

    done(null, user);
  }
}
