import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetLoggedInUser } from './decorators/get-logged-in-user.decorator';
import { UserContextService } from './user-context.service';

@Controller('user-context')
export class UserContextController {
  constructor(private userContextService: UserContextService) {}

  @Get()
  @UseGuards(AuthGuard())
  async findAll(@GetLoggedInUser() loggedInUser: any) {
    return await this.userContextService.getUserContext(loggedInUser);
  }
}
