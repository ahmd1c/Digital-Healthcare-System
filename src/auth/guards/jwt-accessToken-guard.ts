import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../public-decorator';

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard('jwt-access') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: any) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
