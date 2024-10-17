
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ValidationPipe,
  UseGuards,
  Ip,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateInsuranceCompanyDto } from '../insurance-companies/dto/insurance-companies.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { GetLoggedInUser } from './decorators/get-logged-in-user.decorator';
import { GetToken } from './decorators/get-token.decorator';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordGuard } from './guards/reset-password.guard';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('/sign-in')
  login(
    @Body(new ValidationPipe({ transform: true }))
    authCredentialsDto: AuthCredentialsDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: any,
  ): Promise<{ token: string }> {
    return this.service.login(authCredentialsDto, {
      ip,
      userAgent,
    });
  }

  @Get('/sign-out')
  @UseGuards(AuthGuard())
  logout(@GetToken() token: string): any {
    this.service.logout(token);
    return { success: true };
  }

  @Post('/sign-up')
  signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: any,
  ): Promise<any> {
    return this.service.signUp(createUserDto);
  }

  @Post('/forgotPassword')
  forgotPassword(
    @Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto,
  ): Promise<any> {
    return this.service.forgotPassword(forgotPasswordDto);
  }

  @Put('/resetPassword/:token')
  @UseGuards(ResetPasswordGuard)
  resetPassword(
    @Body(ValidationPipe) authResetPasswordDto: AuthResetPasswordDto,
    @Param('token') token: string,
  ): Promise<any> {
    return this.service.resetPassword(authResetPasswordDto, token);
  }

  @Post('/changePassword')
  @UseGuards(AuthGuard())
  changePassword(
    @Body() data: any,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<void> {
    return this.service.changePassword(data, loggedInUser);
  }

  @Post('/updatePassword')
  @UseGuards(AuthGuard())
  updatePassword(
    @Body() data: any,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<void> {
    return this.service.updatePassword(data, loggedInUser);
  }

  @Post('/register-company')
  create(
    @Body(ValidationPipe) body: CreateInsuranceCompanyDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: any,
  ) {
    return this.service.registerCompany(body, { ip, userAgent });
  }
}