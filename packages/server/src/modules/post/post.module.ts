import { Module, forwardRef } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { authProvider } from 'src/modules/auth/auth.provider';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [PostController],
  providers: [PostService, ...authProvider],
  exports: [PostService],
})
export class PostModule {}
