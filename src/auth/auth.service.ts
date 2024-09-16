import { otpTemplate } from './../utils/mail-templates/otp-template';
import { resetPasswordTemplate } from 'src/utils/mail-templates/reset-password-template';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import Constants from 'src/utils/Constants';
import MailService from 'src/utils/mail.service';
import { SendOtpDto, VerifyDto } from './dto/verify.dto';
import { Response } from 'express';
import { DoctorsService } from 'src/doctors/doctors.service';
import { ForgotPassDto } from './dto/forget-password.dto';
import * as crypto from 'crypto';
import { MoreThanOrEqual } from 'typeorm';
import { ResetPassDto } from './dto/reset-pass.dto';
import { ChangePassDto } from './dto/change-pass.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private doctorService: DoctorsService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(createUserDto: CreateUserDto, res: Response) {
    const isRegistered = await this.userService.findOne(
      {
        email: createUserDto.email,
      },
      ['email'],
    );

    if (isRegistered) throw new ConflictException('User already exists');

    const userData = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 11),
      verified: false,
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      role: createUserDto.accType, // THIS WAS VALIDATED INSIDE CREATE USER DTO
    };

    const user = await this.userService.create(userData);
    if (!user) throw new InternalServerErrorException('Failed to create user');

    try {
      await this.mailService.sendMail({
        to: user.email,
        subject: 'Verification code',
        html: otpTemplate(user.otp),
      });
    } catch (err) {
      throw new InternalServerErrorException('Failed to send email');
    }

    const [accessToken, refreshToken] = await this.generateTokens({
      id: user.id,
      role: user.role,
    });
    this.generateCookies(accessToken, refreshToken, res);

    return {
      accessToken,
      refreshToken,
      user,
      message:
        `A verification code has been sent to ${user.email}. ` +
        `please complete your profile` +
        `${user.role === 'doctor' ? 'to get approved' : 'to book an appointment'}`,
    };
  }

  async login(email: string, password: string, res: Response) {
    const user = await this.userService.findOne({ email }, [
      'id',
      'password',
      'role',
    ]);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const paylaod = { id: user.id, role: user.role };
    const [accessToken, refreshToken] = await this.generateTokens(paylaod);
    this.generateCookies(accessToken, refreshToken, res);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(payload: { id: number; role: string }, res: Response) {
    const [accessToken, refreshToken] = await this.generateTokens(payload);
    this.generateCookies(accessToken, refreshToken, res);
    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyOtp(verifyDto: VerifyDto) {
    const user = await this.userService.findOne({ email: verifyDto.email });

    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    if (user.otp !== verifyDto.otp || user.otpExpiry < new Date()) {
      throw new InternalServerErrorException('Invalid OTP');
    }

    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;
    const result = await this.userService.update(user.id, user);
    return {
      message:
        result.affected > 0
          ? 'User verified successfully'
          : 'User not verified',
    };
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    const user = await this.userService.findOne({ email: sendOtpDto.email });
    if (!user) throw new NotFoundException('User not found');

    if (user.verified) throw new BadRequestException('User already verified');

    await this.userService.update(user.id, {
      ...user,
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    try {
      await this.mailService.sendMail({
        to: user.email,
        subject: 'Verification code',
        html: otpTemplate(user.otp),
      });
    } catch (err) {
      throw new InternalServerErrorException('Failed to send email');
    }
    return { message: 'OTP sent successfully' };
  }

  generateTokens(payload: { id: number; role: string }) {
    const accessToken = this.jwtService.signAsync(payload, {
      secret: Constants.JWT_SECRET,
      expiresIn: Constants.JWT_EXPIRES_IN,
    });
    const refreshToken = this.jwtService.signAsync(payload, {
      expiresIn: Constants.JWT_REFRESH_EXPIRES_IN,
      secret: Constants.JWT_REFRESH_SECRET,
    });
    return Promise.all([accessToken, refreshToken]);
  }

  generateCookies(accessToken: string, refreshToken: string, res: Response) {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    });
  }

  async forgotPassword({ email }: ForgotPassDto) {
    const message = `if a user with this email exists, an email has been sent to it`;
    const user = await this.userService.findOne({ email });
    if (!user) return { message };
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(token, 10);
    await this.userService.update(user.id, {
      ...user,
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000),
    });
    try {
      await this.mailService.sendMail({
        to: user.email,
        subject: 'Password reset',
        html: resetPasswordTemplate(token, user.id),
      });
    } catch (err) {
      throw new InternalServerErrorException('Unable to send email');
    }
    return { message };
  }

  async resetPassword({ token, password, userId }: ResetPassDto) {
    const hashedToken = await bcrypt.hash(token, 10);
    const user = await this.userService.findOne({
      id: userId,
      passwordResetToken: hashedToken,
      passwordResetExpires: MoreThanOrEqual(new Date()),
    });
    if (!user) throw new InternalServerErrorException('Invalid token');
    const hashedPassword = await bcrypt.hash(password, 11);
    await this.userService.update(user.id, {
      ...user,
      password: hashedPassword,
      passwordChangedAt: new Date(),
      passwordResetToken: null,
      passwordResetExpires: null,
    });
    return { message: 'Password reset successfully' };
  }

  async changePassword(changePassDto: ChangePassDto, userId) {
    const user = await this.userService.findOne({ id: userId }, ['password']);
    if (!user) throw new BadRequestException('User not found');
    const isMatch = await bcrypt.compare(
      changePassDto.oldPassword,
      user.password,
    );
    if (!isMatch) throw new BadRequestException('Invalid password');
    const hashedPassword = await bcrypt.hash(changePassDto.newPassword, 11);
    await this.userService.update(user.id, {
      ...user,
      password: hashedPassword,
      passwordChangedAt: new Date(),
    });
    return { message: 'Password changed successfully' };
  }
}
