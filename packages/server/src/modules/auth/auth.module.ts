import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_SECRET_KEY, DEFAULT_PASSPORT_STRATEGY } from '../../constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LoginTokenService } from './login-token.service';
import { authProvider } from './auth.provider';
import { ForgotPasswordService } from './forgot-password.service';
import { ResetPasswordEmailService } from './reset-password-email.service';
import { UserContextController } from './user-context.controller';
import { UserContextService } from './user-context.service';
import { Validate } from 'src/helpers/validate';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: DEFAULT_PASSPORT_STRATEGY }),
    JwtModule.register({
      secret: JWT_SECRET_KEY,
    }),
    UserModule,
    Validate
  ],
  controllers: [AuthController, UserContextController],
  providers: [
    AuthService,
    JwtStrategy,
    LoginTokenService,
    UserContextService,
    ForgotPasswordService,
    ResetPasswordEmailService,
    Validate,
    ...authProvider,
  ],
  exports: [JwtStrategy, PassportModule, UserContextService, AuthService],
})
export class AuthModule {}
