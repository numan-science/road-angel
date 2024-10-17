import { Controller, Get, UseGuards, Logger, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetLoggedInUser } from '../auth/decorators/get-logged-in-user.decorator';
import { DashboardService } from './dashboard.service';
import dayjs from 'dayjs';
const _ = require('lodash');
@UseGuards(AuthGuard())
@Controller('stats')
export class DashboardController {
  private logger = new Logger('DashboardController');
  constructor(private readonly service: DashboardService) {}

  @Get('/card-stats')
  getDashboardCardsStats(
    @Query() query: any,
    @GetLoggedInUser() loggedInUser: any,
  ) {
    return this.service.getDashboardCardsStats(query, loggedInUser);
  }

  @Get('/insurance-companies')
  getRecenInsuranceCompanies(@Query() query: any, @GetLoggedInUser() loggedInUser: any) {
    return this.service.getRecentInsuranceCompanies(query, loggedInUser);
  }

  // @Get('/overview')
  // getOverview(@Query() query: any, @GetLoggedInUser() loggedInUser: any) {
  //   return this.service.getOverview(query, loggedInUser);
  // }


}

  
