import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import MailService from 'src/utils/mail.service';
import { LocalStrategy } from './strategies/local-strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy';
import { DoctorsModule } from 'src/doctors/doctors.module';
import { PatientsModule } from 'src/patients/patients.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt-access-strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    UsersModule,
    DoctorsModule,
    PatientsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    MailService,
    JwtStrategy,
    JwtRefreshStrategy,
    LocalStrategy,
  ],
})
export class AuthModule {}
