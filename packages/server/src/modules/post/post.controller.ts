import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Logger,
  Headers,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostService } from './post.service';

@UseGuards(AuthGuard())
@Controller('users')
export class PostController {
  private logger = new Logger('PostController');
  constructor(private readonly userService: PostService) {}
}
