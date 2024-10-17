import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { BusinessCaseService } from './business-case.service';
import { CreateBusinessCaseDto } from './dto/business-case.dto';
import { UpdateBusinessCaseDto } from './dto/business-case.dto';
import { AuthGuard } from '@nestjs/passport';
import { GlobalDbService } from '../global-db/global-db.service';
import { BusinessCase } from './entities/business-case.entity';
import { GetLoggedInUser } from '../auth/decorators/get-logged-in-user.decorator';
import { BusinessCaseDocuments } from './entities/business-case-documents.entity';
import { CreateBusinessCaseDocumentsDto } from './dto/business-case-documents.dto';
import { BusinessCaseActivity } from './entities/business-case-activity.entity';
@UseGuards(AuthGuard())
@Controller('business-case')
export class BusinessCaseController {
  constructor(
    private readonly DB: GlobalDbService,
    private readonly service: BusinessCaseService,
  ) {}

  @Get()
  async getAllBusinessCases(
    @Query('accidentCaseId') accidentCaseId: string,
    @Query() query: any,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<BusinessCase[]> {
    return this.service.findAll(accidentCaseId);
  }

  @Get('/tow-service')
  async getAllBusinessCaseTowService(
    @Query('businessCaseId') businessCaseId: string,
    @Query() query: any,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<BusinessCase[]> {
    return this.service.findAllBusinessCaseTowService(businessCaseId);
  }

  @Get('/business-case-activity/:businessCaseId')
  async getBusinessCaseActivity(
    @Param('businessCaseId') businessCaseId: string,
    @Query() query: any,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<BusinessCaseActivity[]> {
    return this.service.findAllBusinessCaseActivity(businessCaseId);
  }

  @Get('/single-business-case-details')
  async getAllBusinessCase(
    @Query('id') id: string,
    @Query() query: any,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<BusinessCase> {
    return this.service.findBusinessCaseById(id);
  }

  // @Get('/All')
  // async getAllBusinessCasesDetails(
  //   @Query() query: any,
  //   @GetLoggedInUser() loggedInUser: any,
  // ): Promise<BusinessCase[]> {
  //   return this.service.findAllBusinessCasesDetails();
  // }

  @Get('/All')
  findAll(@Query() Param: any, @GetLoggedInUser() loggedInUser: any) {
    return this.service.findBusinessCaseAll(loggedInUser, Param);
  }

  @Get(':id')
  async getBusinessCaseById(@Param('id') id: number): Promise<BusinessCase> {
    return this.service.findById(id);
  }

  @Post('/save')
  async createBusinessCase(
    @Body() createDto: CreateBusinessCaseDto,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<BusinessCase> {
    return this.service.createBusinessCase(createDto, loggedInUser);
  }

  @Post('/save-business-case-activity')
  async createBusinessCaseActivity(
    @Body() createDto: CreateBusinessCaseDto,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<BusinessCase> {
    return this.service.createBusinessCase(createDto, loggedInUser);
  }



  @Put(':id')
  async updateBusinessCase(
    @Param('id') id: string,
    @Body() updateDto: UpdateBusinessCaseDto,
    @GetLoggedInUser() loggedInUser: any,

  ): Promise<{ message: string }> { 
    
    return this.service.save(id, updateDto,loggedInUser);

  }


  @Delete(':id')
  async deleteBusinessCase(@Param('id') id: string): Promise<BusinessCase> {
    return this.service.delete(id);
  }

  @Post('/save-documents')
  async createBusinessCaseDocuments(
    @Body() createDto: CreateBusinessCaseDocumentsDto,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<BusinessCaseDocuments> {
    return this.service.createBusinessCaseDocuments(createDto, loggedInUser);
  }

  @Delete('/business-case-documents/:id')
  async deleteBusinessCaseDocuments(
    @Param('id') id: number,
  ): Promise<BusinessCaseDocuments> {
    return this.service.deleteBusinessCaseDocuments(id);
  }
}
