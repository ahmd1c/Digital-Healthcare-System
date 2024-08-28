import { PickType } from '@nestjs/mapped-types';
import { IsAlphanumeric, IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  otp: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class SendOtpDto extends PickType(VerifyDto, ['email'] as const) {}
