import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import * as config from 'config';
import { User } from '@/entity';
import { AuthService } from '@/module/auth/auth.service';
import { TokenPayload } from '@/interface';

const jwtConfig = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.accessSecret,
    });
  }

  async validate(payload: TokenPayload, done: VerifiedCallback): Promise<any> {
    const { userName } = payload;
    const user: User = await this.authService.findOneByUserName(userName);

    if (!user) {
      return done(
        new UnauthorizedException({ message: 'user does not exist' }),
        false,
      );
    }

    return done(null, user);
  }
}
