import { Injectable, Logger } from '@nestjs/common';
import { Op, Sequelize } from 'sequelize';
import { GlobalDbService } from '../global-db/global-db.service';
import dayjs from 'dayjs';
import { InsuranceCompany } from '../insurance-companies/entities/insurance-companies.entity';
import { TowService } from '../tow_service/entities/tow-service.entity';
import { Workshop } from '../workshop/entities/workshop.entity';
import { Region } from '../region/entities/region.entity';
import { response } from 'express';
const _ = require('lodash');
@Injectable()
export class DashboardService {
  private logger = new Logger('DashboardService');
  constructor(private readonly DB: GlobalDbService) {}

  getDashboardCardsStats = async (params: any, loggedInUser: any) => {
    const { repo } = this.DB;
    const InsuranceCompany = await this.DB.repo.InsuranceCompany.count();
    const TowService = await this.DB.repo.TowService.count();
    const Workshop = await this.DB.repo.Workshop.count();
    const Region = await this.DB.repo.Region.count();
    const BusinessCase = await this.DB.repo.BusinessCase.count();
    const AccidentCase = await this.DB.repo.AccidentCase.count();
    // const LeasingInsuranceCompany =
    //   await this.DB.repo.LeasingInsuranceCompany.count();
    // const DamageInsuranceCompany =
    //   await this.DB.repo.DamageInsuranceCompany.count();

    const cardData = [
      {
        key: 'Accident Case',
        label: 'Total Accident Cases',
        value: AccidentCase || 0,
      },

      {
        key: 'Business Case',
        label: 'Total Business Cases',
        value: BusinessCase || 0,
      },

      {
        key: 'Insurance Company',
        label: 'Total Insurance Companies',
        value: InsuranceCompany || 0,
      },
      {
        key: ' Leasing Insurance Company',
        label: 'Total  Leasing Insurance Companies',
        value: InsuranceCompany || 0,
      },

      {
        key: ' Damage Insurance Company',
        label: 'Total  Damage Insurance Companies',
        value: InsuranceCompany || 0,
      },

      {
        key: 'Tow Service',
        label: 'Total Tow Service',
        value: TowService || 0,
      },
      {
        key: 'Workshop',
        label: 'Total Workshops',
        value: Workshop || 0,
      },
      {
        key: 'Region',
        label: 'Total Regions',
        value: Region || 0,
      },
    ];

    return cardData;
  };

  getRecentInsuranceCompanies = async (params: any, loggedInUser: any) => {
    const { repo } = this.DB;
    const response = await repo.InsuranceCompany.findAll({
      attributes: ['id', 'logo', 'name', 'role', 'createdAt'],
      // include: [
      //   {
      //     model: repo.InsuranceCompany,
      //     attributes: [],
      //     as: 'InsuranceCompany',
      //     required: true,
      //   },

      // ],
      limit: 6,
      order: [['createdAt', 'desc']],
    });

    return response;
  };

 
}
