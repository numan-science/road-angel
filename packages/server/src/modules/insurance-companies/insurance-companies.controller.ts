// import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { GlobalDbService } from 'src/modules/global-db/global-db.service';
import { InsuranceCompany } from './entities/insurance-companies.entity';
import {
  CreateInsuranceCompanyDto,
  UpdateInsuranceCompanyDto,
  DeleteInsuranceCompanyDto,
} from './dto/insurance-companies.dto';
import { GetLoggedInUser } from '../auth/decorators/get-logged-in-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { InsuranceCompanyService } from './insurance-companies.service';

@UseGuards(AuthGuard())
@Controller('insurance-company')
export class InsuranceCompanyController {
  constructor(
    private readonly DB: GlobalDbService,
    private readonly service: InsuranceCompanyService,
  ) {}

  @Get('company-data')
  async getAllInsuranceCompanies(@Query() query: any): Promise<InsuranceCompany[]> {
    return this.service.findAll(query);
  }
  // @Get('search-insurance')
  // findAll(@Query() query: any, @GetLoggedInUser() loggedInUser: any) {
  //   return this.service.getInsuranceCompanies(query, loggedInUser);
  // }

  @Get(':id')
  async getInsuranceCompanyById(
    @Param('id') id: number,
  ): Promise<InsuranceCompany> {
    return this.service.findById(id);
  }

  @Post()
  async createInsuranceCompany(
    @Body() createDto: CreateInsuranceCompanyDto,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<InsuranceCompany> {
    return this.service.createInsuranceCompany(createDto, loggedInUser);
  }

  @Put(':id')
  async updateInsuranceCompany(
    @Param('id') id: number,
    @Body() updateDto: UpdateInsuranceCompanyDto,
  ): Promise<InsuranceCompany> {
    return this.service.save(id, updateDto);
  }

  @Delete(':id')
  async deleteInsuranceCompany(
    @Param('id') id: number,
  ): Promise<InsuranceCompany> {
    return this.service.delete(id);
  }
}
