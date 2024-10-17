// import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GlobalDbService } from 'src/modules/global-db/global-db.service';
import {  LeasingInsuranceCompany } from './entities/leasing-insurance-companies.entity';
import {
  CreateLeasingInsuranceCompanyDto,
  UpdateLeasingInsuranceCompanyDto,
  DeleteLeasingInsuranceCompanyDto,
} from './dto/leasing-insurance-companies.dto';
import { GetLoggedInUser } from '../auth/decorators/get-logged-in-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { LeasingInsuranceCompanyService } from './leasing-insurance-companies.service';

@UseGuards(AuthGuard())
@Controller('leasing-insurance-company')
export class  LeasingInsuranceCompanyController {
  constructor(private readonly DB: GlobalDbService,private readonly service: LeasingInsuranceCompanyService) {}

  @Get('leasing-company-data')
  async getAllLeasingInsuranceCompanies(@Query() query: any): Promise<LeasingInsuranceCompany[]> {
    return this.service.findAll(query);
  }

  @Get(':id')
  async getLeasingInsuranceCompanyById(
    @Param('id') id: number,
  ): Promise<LeasingInsuranceCompany> {
    return this.service.findById(id);
  }

  @Post()
  async createLeasingInsuranceCompany(
    @Body() createDto: CreateLeasingInsuranceCompanyDto,@GetLoggedInUser() loggedInUser: any
  ): Promise<LeasingInsuranceCompany> {
    return this.service.createLeasingInsuranceCompany(createDto,loggedInUser);
  }

  @Put(':id')
  async updateLeasingInsuranceCompany(
    @Param('id') id: number,
    @Body() updateDto: UpdateLeasingInsuranceCompanyDto,
  ): Promise<LeasingInsuranceCompany> {
    
    return this.service.save(id, updateDto);

  }
  

  @Delete(':id')
  async deleteLeasingInsuranceCompany(
    @Param('id') id: number,
  ): Promise<LeasingInsuranceCompany> {
    
    return this.service.delete(id);

  }
}