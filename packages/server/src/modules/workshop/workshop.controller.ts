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
import { Workshop } from './entities/workshop.entity';
import {
  CreateWorkshopDto,
  UpdateWorkshopDto,
  DeleteWorkshopDto,
} from './dto/workshop.dto';
import { GetLoggedInUser } from '../auth/decorators/get-logged-in-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { WorkshopService } from './workshop.service';
import { query } from 'express';

@UseGuards(AuthGuard())
@Controller('workshop')
export class WorkshopController {
  constructor(private readonly service: WorkshopService) {}

  @Get('workshop-data')
  findAll(@GetLoggedInUser() loggedInUser: any, @Query() query: any) {
    return this.service.findAll(loggedInUser, query);
  }

  @Get(':id')
  async getWorkshopById(@Param('id') id: number): Promise<Workshop> {
    return this.service.findById(id);
  }

  @Post()
  async createWorkshop(
    @Body() createDto: CreateWorkshopDto,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<Workshop> {
    return this.service.create(createDto, loggedInUser);
  }

  @Put(':id')
  async updateWorkshop(
    @Body() updateDto: UpdateWorkshopDto,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<Workshop> {
    return this.service.save(updateDto, loggedInUser);
  }

  @Delete(':id')
  async deleteWorkshop(@Param('id') id: number): Promise<Workshop> {
    return this.service.delete(id);
  }
}
