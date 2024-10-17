import { Injectable, NotFoundException } from '@nestjs/common';
import { GlobalDbService } from '../global-db/global-db.service';
import { BusinessCase } from './entities/business-case.entity';
import { CreateBusinessCaseDto } from './dto/business-case.dto';
import { UpdateBusinessCaseDto } from './dto/business-case.dto';
import { create } from 'lodash';
import { BusinessCaseActivity } from './entities/business-case-activity.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateBusinessCaseDocumentsDto } from './dto/business-case-documents.dto';
import { BusinessCaseDocuments } from './entities/business-case-documents.entity';
import { DEFAULT_ROLES } from 'src/constants';
import { Op } from 'sequelize';

@Injectable()
export class BusinessCaseService {
  constructor(private readonly DB: GlobalDbService) {}

  async findAll(accidentCaseId: string): Promise<BusinessCase[]> {
    return this.DB.repo.BusinessCase.findAndCountAll({
      where: { accidentCaseId },
      include: [
        {
          model: this.DB.repo.AccidentCase,
          include: {
            model: this.DB.repo.AccidentScenario,
          },
        },
        {
          model: this.DB.repo.InsuranceCompany,
        },

        {
          model: this.DB.repo.Participant,
          as: 'ParticipantA',
        },
        {
          model: this.DB.repo.Participant,
          as: 'CustomerParticipant',
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
  async findAllBusinessCaseTowService(
    businessCaseId: string,
  ): Promise<BusinessCase[]> {
    return this.DB.repo.BusinessCase.findAndCountAll({
      where: { businessCaseId },
      include: [
        {
          model: this.DB.repo.BusinessCase,
        },
        {
          model: this.DB.repo.TowService,
        },
      ],
    });
  }

  async findAllBusinessCaseActivity(
    businessCaseId: string,
  ): Promise<BusinessCaseActivity[]> {
    return this.DB.repo.BusinessCaseActivity.findAll({
      attributes: ['id', 'actions', 'createdAt', 'updatedAt'],
      where: { businessCaseId },
      include: [
        {
          model: this.DB.repo.BusinessCase,
          attributes: ['id'],
        },
        {
          model: this.DB.repo.User,
          as: 'CreatedBy',
          attributes: ['id', 'username', 'profilePic'],
        },
        {
          model: this.DB.repo.User,
          as: 'UpdatedBy',
          attributes: ['id', 'username', 'profilePic'],
        },
      ],
    });
  }

  async findBusinessCaseById(id: string): Promise<BusinessCase | null> {
    try {
      const businessCase = await this.DB.repo.BusinessCase.findOne({
        where: { id },
        include: [
          {
            model: this.DB.repo.AccidentCase,
            include: {
              model: this.DB.repo.AccidentScenario,
            },
          },
          {
            model: this.DB.repo.InsuranceCompany,
          },
          {
            model: this.DB.repo.Participant,
            as: 'ParticipantA',
          },
          {
            model: this.DB.repo.Participant,
            as: 'CustomerParticipant',
          },
          {
            model: this.DB.repo.Participant,
            as: 'CulpritParticipant',
          },
          {
            model: this.DB.repo.Participant,
            as: 'DamageParticipant',
          },
          {
            model: this.DB.repo.Workshop,
            include: {
              model: this.DB.repo.Region,
            },
          },
          {
            model: this.DB.repo.TowService,
            include: {
              model: this.DB.repo.Region,
            },
          },
          // {
          //   model: this.DB.repo.BusinessCaseTowService,
          // },
        ],
      });

      return businessCase;
    } catch (error) {
      console.error('Error finding business case:', error);
      throw error;
    }
  }

  async findBusinessCaseAll(
    loggedInUser: any,
    params: any,
  ): Promise<BusinessCase[]> {
    const where: any = {};
    const rolewhere: any = {};
    const userWhere: any = {};
    const regionWhere: any = {}; 
    let userRegionRequired :boolean = false

    
    if (params.regionId) {
      regionWhere.regionId = params.regionId;
      userRegionRequired = true
    }

    if (params.roleId) {
      userWhere.roleId = params.roleId;
    }

    if (params.businessCaseId) {
      where.id = params.businessCaseId;
    }

    if (params.status) {
      where.status = params.status;
    }

    if (loggedInUser.user.Role?.name === DEFAULT_ROLES.BUSINESS_MANAGER) {
      userRegionRequired = true
      rolewhere[Op.or] = [
        { name: DEFAULT_ROLES.BUSINESS_MANAGER },
        { name: DEFAULT_ROLES.SALE_MANAGER },
      ];
    }
    
    if (loggedInUser.user.Role?.name === DEFAULT_ROLES.SALE_MANAGER) {
      userRegionRequired = true
      where.createdBy = loggedInUser.user.id;
    }
    
    return this.DB.repo.BusinessCase.findAndCountAll({
      where,
      include: [
        {
          model: this.DB.repo.AccidentCase,
          include: {
            model: this.DB.repo.AccidentScenario,
          },
        },
        {
          model: this.DB.repo.InsuranceCompany,
        },
        {
          model: this.DB.repo.Participant,
          as: 'ParticipantA',
        },
        // {
        //   model: this.DB.repo.Participant,
        //   as: 'ParticipantB',
        // },

        {
          model: this.DB.repo.User,
          required: true,
          attributes: ['id', 'username','roleId'],
          where: userWhere,
          include: [
            {
              model: this.DB.repo.UserRegion,
              attributes: ['id', 'regionId', 'userId'],
              required: userRegionRequired,
              where : regionWhere,
              include: [
                {
                  model: this.DB.repo.Region,
                  attributes: ['id', 'name'],
                },
              ],
            },
            {
              model: this.DB.repo.Role,
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });
  }

  // async findAllBusinessCasesDetails(): Promise<BusinessCase[]> {
  //   return this.DB.repo.BusinessCase.findAll({
  //     include: [
  //       {
  //         model: this.DB.repo.AccidentCase,
  //         include: {
  //           model: this.DB.repo.AccidentScenario,
  //         },
  //       },
  //       {
  //         model: this.DB.repo.InsuranceCompany,
  //       },

  //       {
  //         model: this.DB.repo.Participant,
  //         as: 'ParticipantA',
  //       },
  //       {
  //         model: this.DB.repo.Participant,
  //         as: 'ParticipantB',
  //       },

  //     ],
  //   });
  // }

  async findById(id: number): Promise<BusinessCase> {
    return this.DB.repo.BusinessCase.findByPk(id, {
      include: [
        {
          model: this.DB.repo.BusinessCaseTowService,
        },
      ],
    });
  }

  async createBusinessCase(
    createDto: CreateBusinessCaseDto,
    loggedInUser: any,
  ): Promise<BusinessCase> {
    const randomCaseNumber = Math.floor(Math.random() * 1000000);
    createDto.casenumber = `roadangel-${randomCaseNumber}`;
    const businessCase = await this.DB.save(
      'BusinessCase',
      createDto,
      loggedInUser,
    );

    const activity = {
      businessCaseId: businessCase.id,
      createdAt: businessCase.createdAt,
      createdBy: businessCase.createdBy,
      updatedBy: businessCase.updatedBy,
    };
    await this.DB.save('BusinessCaseActivity', activity, loggedInUser);

    return businessCase;
  }

  async save(
    id: string,
    updateDto: UpdateBusinessCaseDto,
    loggedInUser: any,
  ): Promise<{
    message: string;
    updateDto: UpdateBusinessCaseDto;
  }> {
    const businessCase = await this.DB.repo.BusinessCase.findOne({
      where: { id },
      raw: true,
    });

    const isuuid = (input) => {
      const uuidPattern =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

      return uuidPattern.test(input);
    };

    const getObjectDifferences = async (businessCase, updateDto) => {
      const differences = [];

      for (const key in updateDto) {
        if (
          updateDto.hasOwnProperty(key) &&
          businessCase.hasOwnProperty(key) &&
          businessCase[key] !== updateDto[key]
        ) {
          let before = businessCase[key];
          let after = updateDto[key];
          if (isuuid(businessCase[key]) || isuuid(updateDto[key])) {
            if (key === 'participantA') {
              const participant1 = await this.DB.repo.Participant.findOne({
                where: { id: businessCase[key] },
                raw: true,
              });
              before = participant1?.ownerName || null;

              const participant2 = await this.DB.repo.Participant.findOne({
                where: { id: updateDto[key] },
                raw: true,
              });
              after = participant2?.ownerName || null;
            }

            if (key === 'participantB') {
              const participant1 = await this.DB.repo.Participant.findOne({
                where: { id: businessCase[key] },
                raw: true,
              });
              before = participant1?.ownerName || null;

              const participant2 = await this.DB.repo.Participant.findOne({
                where: { id: updateDto[key] },
                raw: true,
              });
              after = participant2?.ownerName || null;
            }

            if (key == 'insuranceCompanyId') {
              const InsuranceCompany1 =
                await this.DB.repo.InsuranceCompany.findOne({
                  where: { id: businessCase[key] },
                  raw: true,
                });
              before = InsuranceCompany1?.name || null;

              const InsuranceCompany2 =
                await this.DB.repo.InsuranceCompany.findOne({
                  where: { id: updateDto[key] },
                  raw: true,
                });
              after = InsuranceCompany2?.name || null;
            }

            if (key == 'accidentCaseId') {
              const accidentCase1 = await this.DB.repo.AccidentCase.findOne({
                where: { id: businessCase[key] },
                raw: true,
              });
              before = accidentCase1?.name || null;

              const accidentCase2 = await this.DB.repo.AccidentCase.findOne({
                where: { id: updateDto[key] },
                raw: true,
              });
              after = accidentCase2?.name || null;
            }
            if (key == 'towServiceId') {
              const towService1 = await this.DB.repo.TowService.findOne({
                where: { id: businessCase[key] },
                raw: true,
              });
              before = towService1?.name || null;

              const towService2 = await this.DB.repo.TowService.findOne({
                where: { id: updateDto[key] },
                raw: true,
              });
              after = towService2?.name || null;
            }

            if (key == 'workshopId') {
              const Workshop1 = await this.DB.repo.Workshop.findOne({
                where: { id: businessCase[key] },
                raw: true,
              });
              before = Workshop1?.name || null;

              const Workshop2 = await this.DB.repo.Workshop.findOne({
                where: { id: updateDto[key] },
                raw: true,
              });
              after = Workshop2?.name || null;
            }

            if (key == 'createdBy') {
              const cretaedBy1 = await this.DB.repo.User.findOne({
                where: { id: businessCase[key] },
                raw: true,
              });
              before = cretaedBy1?.name || null;

              const createdBy2 = await this.DB.repo.User.findOne({
                where: { id: updateDto[key] },
                raw: true,
              });
              after = createdBy2?.name || null;
            }

            if (key == 'updatedBy') {
              const updatedBy1 = await this.DB.repo.User.findOne({
                where: { id: businessCase[key] },
                raw: true,
              });
              before = updatedBy1?.name || null;

              const updatedBy2 = await this.DB.repo.User.findOne({
                where: { id: updateDto[key] },
                raw: true,
              });
              after = updatedBy2?.name || null;
            }
          }
          differences.push({ key, before, after });
          businessCase[key] = updateDto[key];
        }
      }

      return differences;
    };

    const differences = await getObjectDifferences(businessCase, updateDto);

    const savedBusinessCase = await this.DB.save(
      'BusinessCase',
      businessCase,
      loggedInUser,
    );
    const activity: any = {
      businessCaseId: savedBusinessCase.id,
      createdAt: savedBusinessCase.createdAt,
      updatedAt: savedBusinessCase.updatedAt,
      updatedBy: savedBusinessCase.updatedBy,
      createdBy: savedBusinessCase.createdBy,
      actions: differences,
    };

    await this.DB.save('BusinessCaseActivity', activity, loggedInUser);

    return businessCase;
  }

  async delete(id: string): Promise<BusinessCase> {
    return this.DB.repo.BusinessCase.destroy({ where: { id } });
  }

  async createBusinessCaseDocuments(
    createDto: CreateBusinessCaseDocumentsDto,
    loggedInUser: any,
  ): Promise<BusinessCaseDocuments> {
    return this.DB.save('BusinessCaseDocuments', createDto, loggedInUser);
  }

  async deleteBusinessCaseDocuments(
    id: number,
  ): Promise<BusinessCaseDocuments> {
    return this.DB.repo.BusinessCaseDocuments.destroy({ where: { id } });
  }
}
