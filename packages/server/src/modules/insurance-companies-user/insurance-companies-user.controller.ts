import {
  Controller,
  Get,
  Delete,
  Logger,
  Put,
  UseInterceptors,
  Post,
  Body,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Transaction } from 'sequelize';
import { TransactionParam } from 'src/database/transaction-param.decorator';
import { TransactionInterceptor } from 'src/database/transaction.interceptor';
import { GetLoggedInUser } from '../auth/decorators/get-logged-in-user.decorator';
import {  InsuranceCompanyUserService } from './insurance-companies-user.service';
import { CreateInsuranceCompanyUserDto } from './dto/create-insurance-company-user.dto';

@UseGuards(AuthGuard())
@Controller('insurance-company-user')
export class InsuranceCompanyUserController {
  private logger = new Logger('InsuranceCompanyUserController');
  constructor(private readonly service: InsuranceCompanyUserService) {}

  @UseInterceptors(TransactionInterceptor)
  @Post('/save')
  saveInsuranceCompanyUser(
    @Body() data: CreateInsuranceCompanyUserDto,
    @GetLoggedInUser() loggedInUser: any,
    @TransactionParam() transaction: Transaction,
  ) {
    return this.service.saveinsuranceCompanyUser(data, loggedInUser, transaction);
  }

  @Get()
  findAll(@Query() query: any, @GetLoggedInUser() loggedInUser: any) {
    return this.service.getAll(query, loggedInUser);
  }

  @Get(':id')
  findOne() {
    return 'getOne';
  }

  @Put(':id')
  update() {
    return 'update';
  }

  @UseInterceptors(TransactionInterceptor)
  @Delete('/:id')
  remove(
    @Param('id') insuranceCompanyUserId: string,
    @GetLoggedInUser() loggedInUser: any,
    @TransactionParam() transaction: Transaction,
  ) {
    return this.service.delete(insuranceCompanyUserId, loggedInUser, transaction);
  }
}
