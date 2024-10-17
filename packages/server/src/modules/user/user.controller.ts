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
  Ip,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { GetLoggedInUser } from '../auth/decorators/get-logged-in-user.decorator';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { response } from 'express';

@UseGuards(AuthGuard())
@Controller('users')
export class UserController {
  private logger = new Logger('UserController');
  constructor(private readonly userService: UserService) {}

  
  @Get()
  findAll(@Query() query: any, @GetLoggedInUser() loggedInUser: any) {
    return this.userService.getAll(query, loggedInUser);
  }
 
  
  @Post('/save')
  signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: any,
    @GetLoggedInUser() loggedInUser: any
  ): Promise<any> {
    return this.userService.save(createUserDto, loggedInUser );
  }


  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: CreateUserDto,
    @GetLoggedInUser() loggedInUser: any,
  ) {
    return this.userService.update(data, loggedInUser, id);
  }


  @Post('/update-password')
  updatePassword(@Body() body: any, @GetLoggedInUser() loggedInUser: any) {
    return this.userService.updatePassword(body, loggedInUser);
  }
  @Delete(':id')
  async deleteUser(
    @Param('id') id: number,
  ): Promise<User> {
    
    return this.userService.delete(id);

  }
}





