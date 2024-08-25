import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import MailService from 'src/utils/mail.service';
import { LocalStrategy } from './strategies/local-strategy';
import { JwtStrategy } from './strategies/jwt-access-strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    MailService,
    LocalStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtStrategy,
    },
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
