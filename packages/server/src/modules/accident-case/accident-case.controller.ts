import {
  Controller,
  Get,
  UseGuards,
  Logger,
  Query,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetLoggedInUser } from '../auth/decorators/get-logged-in-user.decorator';
import { AccidentCaseService } from './accident-case.service';
import { Participant } from './entities/participant.entity';
import { GlobalDbService } from '../global-db/global-db.service';
import { CreateParticipantDto, UpdateParticipantDto} from './dto/participant.dto';
import { AccidentScenario } from './entities/accident-scnario.entity';
import { AccidentCase } from './entities/accident-case.entity ';
import { CreateAccidentScenarioDto } from './dto/accident-scnario.dto';
import { CreateAccidentCaseDto, UpdateAccidentCaseDto } from './dto/accident-case.dto ';
import { CreateAccidentDocumentDto, UpdateAccidentDocumentDto } from './dto/accident-document.dto';
import { AccidentCaseDocuments } from './entities/accident-case-documents.entity';

@UseGuards(AuthGuard())
@Controller('submit-case')
export class AccidentCaseController {
  constructor(
    private readonly DB: GlobalDbService,
    private readonly service: AccidentCaseService,
  ) {}

  @Get('/participant')
  async getAllParticipant(
    @Query('accidentCaseId') accidentCaseId: string,
    @Query() query: any, @GetLoggedInUser() loggedInUser: any
  ): Promise<Participant[]> {
    return this.service.findAll(accidentCaseId);
  }

  @Post('/save-participant')
  async createParticipant(
    @Body() createDto: CreateParticipantDto,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<Participant> {
    return this.service.createParticipant(createDto, loggedInUser);
  }


  
  @Post('/save-participant-type')
  async setParticipantType(
    @Body() createDto: CreateParticipantDto,
    @GetLoggedInUser() loggedInUser: any,
  ) {
    return this.service.setParticipantType(createDto, loggedInUser);
  }

  @Get('/accident-scenario')
  async getAllAccidentScenarios(): Promise<AccidentScenario[]> {
    return this.service.findAccidentScenarioAll();
  }

  @Put('/participant/:id')
  async updateParticipant(
    @Param('id') id: number,
    @Body() updateDto: UpdateParticipantDto,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<{ message: string }> { 
    
    return this.service.update(id, updateDto,loggedInUser);
  }



  @Delete('/participant/:id')
  async deleteParticipant(@Param('id') id: number): Promise<Participant> {
    return this.service.delete(id);
  }

  @Get('/accident-scenario/:id')
  async getAccidentScenarioById(
    @Param('id') id: number,
  ): Promise<AccidentScenario> {
    return this.service.findAccidentScenarioById(id);
  }

  @Post('/save-accident-scenario')
  async createAccidentScnario(
    @Body() createDto: CreateAccidentScenarioDto,
  ): Promise<AccidentScenario> {
    return this.service.createAccidentScenario(createDto);
  }

  @Get('/accident-case')
  findAll(@Query() query: any, @GetLoggedInUser() loggedInUser: any) {
    return this.service.findAccidentCaseAll(loggedInUser, query);
  }

  @Get('/accident-case/:id')
  async getAccidentCaseById(@Param('id') id: number): Promise<AccidentCase> {
    return this.service.findAccidentCaseById(id);
  }

  @Post('/save-accident-case')
  async createAccidentCase(
    @Body() createDto: CreateAccidentCaseDto,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<AccidentCase> {
    return this.service.createAccidentCase(createDto, loggedInUser);
  }

  @Get('/accident-documents')
  async getAccidentDocument(
    @Query('accidentCaseId') accidentCaseId: string,
    @Query() query: any, @GetLoggedInUser() loggedInUser: any
  ): Promise<AccidentCaseDocuments[]> {
    return this.service.findAllDocument(accidentCaseId);
  }
  @Post('/save-accident-documents')
  async createAccidentDocument(
    @Body() createDto: CreateAccidentDocumentDto,
    @GetLoggedInUser() loggedInUser: any,
  ): Promise<AccidentCaseDocuments> {
    return this.service.createAccidentDocument(createDto, loggedInUser);
  }

  @Put('/save-accident-documents/:id')
  async updateAccidentDocument(
    @Param('id') id: number,
    @Body() updateDto: UpdateAccidentDocumentDto,
  ): Promise<{ message: string }> { 
    
    return this.service.updateAccidentDocument(id, updateDto);

  }

  @Get('/accident-documents/:id')
  async getAccidentDocumentById(@Param('id') id: string): Promise<AccidentCaseDocuments> {
    return this.service.findAccidentDocumentId(id);
  }


  // @Get('/single-business-case-details')
  // async getAllBusinessCase(
  //   @Query('id') id: string,
  //   @Query() query: any,
  //   @GetLoggedInUser() loggedInUser: any,
  // ): Promise<BusinessCase> {
  //   return this.service.findBusinessCaseById(id);
  // }

  @Delete('/save-accident-documents/:id')
  async deleteAccidentDocument(@Param('id') id: number): Promise<AccidentCaseDocuments> {
    return this.service.deleteAccidentDocument(id);
  }


  @Put('/accident-case/:id')
  async updateAccidentCase(
    @Param('id') id: number,
    @Body() updateDto: UpdateAccidentCaseDto,
  ): Promise<{ message: string }> { 
    
    return this.service.updateAccidentCase(id, updateDto);

  }

  @Delete('/accident-case/:id')
  async deleteAccidentCase(@Param('id') id: number): Promise<AccidentCase> {
    return this.service.deleteAccidentCase(id);
  }

  @Get('/participant/:accidentCaseId')
  async getParticipantById(
    @Param('accidentCaseId') accidentCaseId: number,
  ): Promise<Participant> {
    return this.service.findById(accidentCaseId);
  }
  
}

