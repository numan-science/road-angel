import { Injectable } from '@nestjs/common';
import { InsuranceCompany } from './entities/insurance-companies.entity';
import {
  CreateInsuranceCompanyDto,
  UpdateInsuranceCompanyDto,
} from './dto/insurance-companies.dto';
import { GlobalDbService } from '../global-db/global-db.service';
import { Sequelize } from 'sequelize';
import { getPaginationOptions } from 'src/helpers/seql';

@Injectable()
export class InsuranceCompanyService {
  constructor(private readonly DB: GlobalDbService) {}

  async findAll( params: any): Promise<InsuranceCompany[]> {
    const where: any = {};
    const paginationOptions: any = getPaginationOptions(params);
    if (params.name) {
      where.name = params.name;
    }
    return this.DB.repo.InsuranceCompany.findAndCountAll({
      where,
      limit: paginationOptions.limit,
      offset: paginationOptions.offset,
      order: [['id', 'desc']],
    });
  }

  async findById(id: number): Promise<InsuranceCompany> {
    return this.DB.repo.InsuranceCompany.findByPk(id);
  }

  async createInsuranceCompany(
    createDto: CreateInsuranceCompanyDto,
    loggedInUser: any,
  ): Promise<InsuranceCompany> {
    return this.DB.save('InsuranceCompany', createDto, loggedInUser);
  }

  async save(
    id: number,
    updateDto: UpdateInsuranceCompanyDto,
  ): Promise<InsuranceCompany> {
    return this.DB.repo.InsuranceCompany.update(updateDto, { where: { id } });
  }

  async delete(id: number): Promise<InsuranceCompany> {
    return this.DB.repo.InsuranceCompany.destroy({ where: { id } });
  }

  // getInsuranceCompanies = async (params: any, loggedInUser: any) => {
  //   const { repo } = this.DB;
  //   const where: any = {};


  //   try {
  //     const response = await repo.InsuranceCompany.findAndCountAll({
  //       where,
  //       attributes: [
  //         [Sequelize.fn('DISTINCT', Sequelize.col('name')), 'company'],
  //       ],
  //     });

  //     const companies = response
  //       .map((item) => item.get('company'))
  //       .filter((company) => company !== null && company !== undefined);
        
  //     console.log('companies', companies);
  //     return companies;
  //   } catch (error) {
  //     throw new Error('Failed to retrieve companies from InsuranceCompany.');
  //   }
  // };
}
