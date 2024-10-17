import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-post.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
