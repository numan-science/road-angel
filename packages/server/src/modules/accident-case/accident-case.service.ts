import { Injectable, Logger } from '@nestjs/common';
import { Op, Sequelize } from 'sequelize';
import { GlobalDbService } from '../global-db/global-db.service';
import dayjs from 'dayjs';
import { User } from 'aws-sdk/clients/budgets';
import { Participant } from './entities/participant.entity';
import { AccidentScenario } from './entities/accident-scnario.entity';
import { AccidentCase } from './entities/accident-case.entity ';
import { Id } from 'aws-sdk/clients/robomaker';
import { DEFAULT_ROLES } from 'src/constants';
import { GetLoggedInUser } from '../auth/decorators/get-logged-in-user.decorator';
import { query } from 'express';
import {
  CreateParticipantDto,
  UpdateParticipantDto,
} from './dto/participant.dto';
import {
  CreateAccidentCaseDto,
  UpdateAccidentCaseDto,
} from './dto/accident-case.dto ';
import { CreateAccidentScenarioDto } from './dto/accident-scnario.dto';
import {
  CreateAccidentDocumentDto,
  UpdateAccidentDocumentDto,
} from './dto/accident-document.dto';
import { AccidentCaseDocuments } from './entities/accident-case-documents.entity';

const _ = require('lodash');
@Injectable()
export class AccidentCaseService {
  private logger = new Logger('AccidentCaseService');
  AccidentCaseRepository: any;
  constructor(private readonly DB: GlobalDbService) {}

  async findAll(accidentCaseId: string): Promise<Participant[]> {
    return this.DB.repo.Participant.findAndCountAll({
      where: { accidentCaseId },

      include: [
        {
          model: this.DB.repo.AccidentCase,
        },
        {
          model: this.DB.repo.LeasingInsuranceCompany,
        },

        {
          model: this.DB.repo.InsuranceCompany,
          as: 'LiabilityInsuranceCompany',
        },
        {
          model: this.DB.repo.InsuranceCompany,
          as: 'DamageInsuranceCompany',
        },
      ],
    });
  }
  async findAllDocument(
    accidentCaseId: string,
  ): Promise<AccidentCaseDocuments[]> {
    return this.DB.repo.AccidentCaseDocuments.findAndCountAll({
      where: { accidentCaseId },
      include: [
        {
          model: this.DB.repo.AccidentCase,
          include: {
            model: this.DB.repo.AccidentScenario,
          },
        },
        {
          model: this.DB.repo.Participant,
          as: 'CulpritParticipant',
        },
        {
          model: this.DB.repo.Participant,
          as: 'DamageParticipant',
        },
      ],
    });
  }

  async findById(accidentCaseId: number): Promise<Participant> {
    return this.DB.repo.Participant.findByPk(accidentCaseId);
  }
  // private lastLabel = 'A';
  // private incrementLabel(charCode = 0) {
  //   return String.fromCharCode(charCode)
  //   const currentCharCode = this.lastLabel.charCodeAt(0);

  //   if (
  //     currentCharCode >= 'A'.charCodeAt(0) &&
  //     currentCharCode < 'Z'.charCodeAt(0)
  //   ) {
  //     this.lastLabel = String.fromCharCode(currentCharCode + 1);
  //   } else {
  //     this.lastLabel = 'A';
  //   }
  // }
  async createParticipant(
    createDto: CreateParticipantDto,
    loggedInUser: any,
  ): Promise<Participant> {


    const response = await this.DB.repo.Participant.count({
      where: { accidentCaseId: createDto.accidentCaseId },
    });
    createDto.label = String.fromCharCode(65 + response || 65)
    

    return this.DB.save('Participant', createDto, loggedInUser);
  }

  async setParticipantType(createDto: any, loggedInUser: any) {
    for (const participant of createDto) {
      await this.DB.save('Participant', participant, loggedInUser);
    }
    return { message: 'Successfully' };
  }

  async update(
    id: number,
    updateDto: any,
    loggedInUser: any,
  ): Promise<{ message: string }> {
    updateDto.id = id;
    return this.DB.save('Participant', updateDto, loggedInUser);
  }

  async delete(id: number): Promise<Participant> {
    return this.DB.repo.Participant.destroy({ where: { id } });
  }

  async findAccidentScenarioAll(): Promise<AccidentScenario[]> {
    return this.DB.repo.AccidentScenario.findAndCountAll({
      include: [
        {
          model: this.DB.repo.AccidentCase,
        },
      ],
    });
  }

  async findAccidentScenarioById(id: number): Promise<AccidentScenario> {
    return this.DB.repo.AccidentScenario.findByPk(id);
  }

  async createAccidentScenario(
    createDto: CreateAccidentScenarioDto,
  ): Promise<AccidentScenario> {
    return this.DB.repo.AccidentScenario.create(createDto);
  }

  async updateAccidentCase(
    id: number,
    updateDto: UpdateAccidentCaseDto,
  ): Promise<{ message: string }> {
    await this.DB.repo.AccidentCase.update(updateDto, { where: { id } });
    return this.DB.getOne('AccidentCase', { id });
  }

  async deleteAccidentCase(id: number): Promise<AccidentCase> {
    return this.DB.repo.AccidentCase.destroy({ where: { id } });
  }

  async updateAccidentDocument(
    id: number,
    updateDto: UpdateAccidentDocumentDto,
  ): Promise<{ message: string }> {
    await this.DB.repo.AccidentCaseDocuments.update(updateDto, {
      where: { id },
    });
    return this.DB.getOne('AccidentCaseDocuments', { id });
  }

  async deleteAccidentDocument(id: number): Promise<AccidentCaseDocuments> {
    return this.DB.repo.AccidentCaseDocuments.destroy({ where: { id } });
  }

  async findAccidentCaseAll(
    loggedInUser: any,
    params: any,
  ): Promise<AccidentCase[]> {
    const where: any = {};
    const rolewhere: any = {};
    const userWhere: any = {};
    const regionWhere: any = {};
    let userRegionRequired: boolean = false;

    if (loggedInUser.user.Role?.name === DEFAULT_ROLES.SALE_MANAGER) {
      where.createdBy = loggedInUser.user.id;
    }

    if (loggedInUser.user.Role?.name === DEFAULT_ROLES.BUSINESS_MANAGER) {
      rolewhere[Op.or] = [
        { name: DEFAULT_ROLES.BUSINESS_MANAGER },
        { name: DEFAULT_ROLES.SALE_MANAGER },
      ];
    }

    if (params.regionId) {
      regionWhere.regionId = params.regionId;
      userRegionRequired = true;
    }

    if (params.roleId) {
      userWhere.roleId = params.roleId;
    }

    if (params.accidentCaseId) {
      where.id = params.accidentCaseId;
    }

    if (params.status) {
      where.status = params.status;
    }

    return this.DB.repo.AccidentCase.findAndCountAll({
      where,
      include: [
        {
          model: this.DB.repo.Participant,
        },
        {
          model: this.DB.repo.User,
          required: true,
          where: userWhere,
          include: [
            {
              model: this.DB.repo.UserRegion,
              attributes: ['id', 'regionId', 'userId'],
              required: userRegionRequired,
              where: regionWhere,
              include: [
                {
                  model: this.DB.repo.Region,
                  attributes: ['id', 'name'],
                },
              ],
            },
            {
              model: this.DB.repo.Role,
              where: rolewhere,
              required: true,
            },
          ],
        },
      ],
    });
  }

  async findAccidentCaseById(id: number): Promise<AccidentCase> {
    return this.DB.repo.AccidentCase.findByPk(id);
  }

  // async findAccidentDocumentId(id: number): Promise<AccidentCaseDocuments> {
  //   return this.DB.repo.AccidentCaseDocuments.findByPk(id);
  // }

  async findAccidentDocumentId(
    id: string,
  ): Promise<AccidentCaseDocuments | null> {
    try {
      const participantDocument = await this.DB.repo.AccidentCaseDocuments.findByPk(
        {
          where: { id },
          include: [
            {
              model: this.DB.repo.AccidentCase,
              include: {
                model: this.DB.repo.AccidentScenario,
              },
            },
            {
              model: this.DB.repo.Participant,
              as: 'CulpritParticipant',
            },
            {
              model: this.DB.repo.Participant,
              as: 'DamageParticipant',
            },
          ],
        },
      );

      return participantDocument;
    } catch (error) {
      console.error('Error finding business case:', error);
      throw error;
    }
  }

  async createAccidentCase(
    createDto: CreateAccidentCaseDto,
    loggedInUser: any,
  ): Promise<AccidentCase> {
    return this.DB.save('AccidentCase', createDto, loggedInUser);
  }

  async createAccidentDocument(
    createDto: CreateAccidentDocumentDto,
    loggedInUser: any,
  ): Promise<AccidentCaseDocuments> {
    return this.DB.save('AccidentCaseDocuments', createDto, loggedInUser);
  }
}
