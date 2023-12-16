import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as config from 'config';
import { User } from '@/entity';
import { AuthService } from '@/module/auth/auth.service';

const jwtConfig = config.get('jwt');

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.accessSecret,
    });
  }

  async validate(payload) {
    const { userId } = payload;
    const user: User = await this.authService.findOneByUserId(userId);

    if (!user) {
      throw new UnauthorizedException({ message: 'user does not exist' });
    }

    return user;
  }
}
