import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import Constants from 'src/utils/Constants';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.refresh_token,
        ExtractJwt.fromAuthHeaderWithScheme('refresh'),
        ExtractJwt.fromAuthHeaderWithScheme('Refresh'),
      ]),
      ignoreExpiration: false,
      secretOrKey: Constants.JWT_REFRESH_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    return { id: payload.id, role: payload.role };
  }
}
