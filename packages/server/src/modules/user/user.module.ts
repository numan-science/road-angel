import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { userProvider } from './user.provider';
import { UserController } from './user.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { authProvider } from 'src/modules/auth/auth.provider';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService, ...userProvider,...authProvider],
  exports: [...userProvider, UserService],
})
export class UserModule {}
