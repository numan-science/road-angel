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
import { Region } from './entities/region.entity';
import {
  CreateRegionDto,
  UpdateRegionDto,
  DeleteRegionDto,
} from './dto/region.dto';
import { GetLoggedInUser } from '../auth/decorators/get-logged-in-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RegionService } from './region.service';
import {} from 'mysql2/typings/mysql/lib/protocol/sequences/Query';
import { query } from 'express';

@UseGuards(AuthGuard())
@Controller('region')
export class RegionController {
  constructor(
    private readonly DB: GlobalDbService,
    private readonly service: RegionService,
  ) {}

  @Get('region-data')
  async findAll(
    @GetLoggedInUser() loggedInUser: any,
    @Query() query: any,
  ): Promise<Region[]> {
    return this.service.findAll(query, loggedInUser);
  }

  @Get(':id')
  async getRegionById(@Param('id') id: number): Promise<Region> {
    return this.DB.repo.Region.findById(id);
  }

  @Post()
  async createRegion(
    @Body() createDto: CreateRegionDto,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<Region> {
    return this.service.create(createDto, loggedInUser);
  }

  @Put(':id')
  async Region(
    @Param('id') id: number,
    @Body() updateDto: UpdateRegionDto,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<Region> {
    return this.DB.save('Region', { ...updateDto, id }, loggedInUser);
  }

  @Delete(':id')
  async deleteRegion(
    @Param('id') id: number,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<Region> {
    return this.DB.delete('Region', { id }, loggedInUser);
  }
}
