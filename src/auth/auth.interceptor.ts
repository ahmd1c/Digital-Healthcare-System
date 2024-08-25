import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        ...data,
        user: {
          ...data.user,
          password: undefined,
          passwordChangedAt: undefined,
          passwordResetToken: undefined,
          passwordResetExpires: undefined,
          otp: undefined,
          otpExpiry: undefined,
          createdAt: undefined,
          updatedAt: undefined,
        },
      })),
    );
  }
}
