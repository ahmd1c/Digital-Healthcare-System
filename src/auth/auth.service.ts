// import { otpTemplate } from './../utils/mail-templates/otp-template';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import Constants from 'src/utils/Constants';
import { AuthInterceptor } from './auth.interceptor';
import MailService from 'src/utils/mail.service';
import { SendOtpDto, VerifyDto } from './dto/verify.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  @UseInterceptors(AuthInterceptor)
  async register(createUserDto: CreateUserDto) {
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
    console.log(user);

    // await this.mailService.sendMail({
    //   to: user.email,
    //   subject: 'Verification code',
    //   html: otpTemplate(user.otp),
    // });

    const [accessToken, refreshToken] = await this.generateTokens({
      userId: user.id,
      role: user.role,
    });

    return {
      accessToken,
      refreshToken,
      user,
      message:
        `A verification code has been sent to ${user.email}. ` +
        `please complete your profile ${user.role === 'DOCTOR' ? 'to get approved' : 'to book an appointment'}`,
    };
  }

  async verifyOtp(verifyDto: VerifyDto) {
    const user = await this.userService.findOne({ email: verifyDto.email });

    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    if (user.otp !== verifyDto.otp) {
      throw new InternalServerErrorException('Invalid OTP');
    }
    if (user.otpExpiry < new Date()) {
      throw new InternalServerErrorException('OTP expired');
    }
    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;
    const result = await this.userService.update(user.id, user);
    return {
      message:
        result.affected > 0 ? 'User verified successfully' : 'User not found',
    };
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    const user = await this.userService.findOne({ email: sendOtpDto.email });
    if (!user) throw new InternalServerErrorException('User not found');

    if (user.verified)
      throw new InternalServerErrorException('User already verified');

    user.otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await this.userService.update(user.id, user);

    // await this.mailService.sendMail({
    //   to: user.email,
    //   subject: 'Verification code',
    //   html: otpTemplate(user.otp),
    // });
    // IT REACHES HERE ONLY IF MSG IS SENT
    return { message: 'OTP sent successfully' };
  }

  generateTokens(payload: { userId: number; role: string }) {
    const accessToken = this.jwtService.signAsync(payload, {
      secret: Constants.JWT_SECRET,
      expiresIn: Constants.JWT_EXPIRES_IN,
    });
    const refreshToken = this.jwtService.signAsync(
      { userId: payload.userId },
      {
        expiresIn: Constants.JWT_REFRESH_EXPIRES_IN,
        secret: Constants.JWT_REFRESH_SECRET,
      },
    );
    return Promise.all([accessToken, refreshToken]);
  }
}
