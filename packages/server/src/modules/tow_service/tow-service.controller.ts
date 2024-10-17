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
import { TowService } from './entities/tow-service.entity';
import {
  CreateTowServiceDto,
  UpdateTowServiceDto,
  DeleteTowServiceDto,
} from './dto/tow-service.dto';
import { GetLoggedInUser } from '../auth/decorators/get-logged-in-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { TowServiceService } from './tow-service.service';
import { query } from 'express';

@UseGuards(AuthGuard())
@Controller('tow-service')
export class TowServiceController {
  constructor(private readonly DB: GlobalDbService,private readonly service: TowServiceService) {}

  @Get('tow-service-data')
  findAll(@GetLoggedInUser() loggedInUser: any, @Query() query: any) {
    return this.service.findAll(loggedInUser, query);
  }

  @Get(':id')
  async getTowServiceById(
    @Param('id') id: number,
  ): Promise<TowService> {
    return this.DB.repo.TowService.findById(id);
  }


  @Post()
  async createTowService(
    @Body() createDto: CreateTowServiceDto,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<TowService> {
    return this.service.create(createDto, loggedInUser);
  }



  @Put(':id')
  async updateTowService(
    @Param('id') id: number,
    @Body() updateDto: UpdateTowServiceDto,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<TowService> {
    
    return this.DB.save('TowService', { ...updateDto, id }, loggedInUser);

  }

  @Delete(':id')
  async deleteTowService(
    @Param('id') id: number,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<TowService> {
    
    return this.DB.delete('TowService', { id }, loggedInUser);

  }
}
