import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthInterceptor } from './auth.interceptor';
import { SendOtpDto, VerifyDto } from './dto/verify.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './public-decorator';
import { Response as ExpressResponse } from 'express';

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
  @UseInterceptors(AuthInterceptor)
  @Post('login')
  login(@Request() req, @Response({ passthrough: true }) res: ExpressResponse) {
    return this.authService.login(req.user.email, req.user.password, res);
  }

  @Public() // this only to avoid the global access token guard
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  refresh(
    @Request() req,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    return this.authService.refreshToken(req.user, res);
  }

  @Public()
  @Post('logout')
  logout(@Response({ passthrough: true }) res: ExpressResponse) {
    res.clearCookie('access_token').clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }
}
