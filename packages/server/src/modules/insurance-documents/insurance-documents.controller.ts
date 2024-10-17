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
} from '@nestjs/common';
import { GlobalDbService } from 'src/modules/global-db/global-db.service';
import { InsuranceDocuments } from './entities/insurance-documents.entity';
import {
  CreateInsuranceDocumetsDto,
  UpdateInsuranceDocumentsDto,
  DeleteInsuranceDocumentsDto
} from './dto/insurance-documents.dto';
import { GetLoggedInUser } from '../auth/decorators/get-logged-in-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { InsuranceDocumentsService } from './insurance-documents.service';

@UseGuards(AuthGuard())
@Controller('insurance-documents')
export class InsuranceDocumentsController {
  constructor(private readonly DB: GlobalDbService,private readonly service: InsuranceDocumentsService) {}

  @Get()
  async getAllInsuranceDocuments(): Promise<InsuranceDocuments[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async getInsuranceDocumentsById(
    @Param('id') id: number,
  ): Promise<InsuranceDocuments> {
    return this.service.findById(id);
  }

  @Post()
  async createInsuranceDocuments(
    @Body() createDto: CreateInsuranceDocumetsDto,
  ): Promise<{ message: string }> {

      return this.service.create(createDto);
    }
  

  @Put(':id')
  async updateInsuranceDocuments(
    @Param('id') id: number,
    @Body() updateDto: UpdateInsuranceDocumentsDto,
  ): Promise<InsuranceDocuments> {
    
    return this.service.save(id, updateDto);

  }
  

  @Delete(':id')
  async deleteInsuranceDocuements(
    @Param('id') id: number,
  ): Promise<InsuranceDocuments> {
    
    return this.service.delete(id);

  }
}