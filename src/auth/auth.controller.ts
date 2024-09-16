import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UseGuards,
  Response,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthInterceptor } from './auth.interceptor';
import { SendOtpDto, VerifyDto } from './dto/verify.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './public-decorator';
import { Response as ExpressResponse } from 'express';
import { ForgotPassDto } from './dto/forget-password.dto';
import { ResetPassDto } from './dto/reset-pass.dto';
import { ChangePassDto } from './dto/change-pass.dto';
import User from 'src/utils/decorators/USER.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseInterceptors(AuthInterceptor)
  @Post('register')
  create(
    @Body() createUserDto: CreateUserDto,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    return this.authService.register(createUserDto, res);
  }

  @Post('verify')
  verifyOtp(@Body() verifyDto: VerifyDto) {
    return this.authService.verifyOtp(verifyDto);
  }

  @Post('send-verification-otp')
  sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto);
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@User() user, @Response({ passthrough: true }) res: ExpressResponse) {
    return this.authService.login(user.email, user.password, res);
  }

  @Public() // this only to avoid the global access token guard
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  refresh(@User() user, @Response({ passthrough: true }) res: ExpressResponse) {
    return this.authService.refreshToken(user, res);
  }

  @Public()
  @Post('logout')
  logout(@Response({ passthrough: true }) res: ExpressResponse) {
    res.clearCookie('access_token').clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: ForgotPassDto) {
    return this.authService.forgotPassword(email);
  }

  @Public()
  @Patch('reset-password')
  async resetPassword(@Body() resetPassDto: ResetPassDto) {
    return this.authService.resetPassword(resetPassDto);
  }

  @Patch('change-password')
  async changePassword(@Body() changePassDto: ChangePassDto, @User() user) {
    return this.authService.changePassword(changePassDto, user.id);
  }
}
