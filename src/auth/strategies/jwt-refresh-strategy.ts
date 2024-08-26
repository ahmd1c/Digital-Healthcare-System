import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import Constants from 'src/utils/Constants';

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
      secretOrKey: Constants.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    return { userId: payload.sub, role: payload.role };
  }
}
