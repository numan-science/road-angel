import { Injectable } from '@nestjs/common';
import {  LeasingInsuranceCompany } from './entities/leasing-insurance-companies.entity';
import { GlobalDbService } from '../global-db/global-db.service';
import { CreateLeasingInsuranceCompanyDto, UpdateLeasingInsuranceCompanyDto } from './dto/leasing-insurance-companies.dto';
import { getPaginationOptions } from 'src/helpers/seql';

@Injectable()
export class LeasingInsuranceCompanyService {

  constructor(
    private readonly DB: GlobalDbService,
  ) {}

  async findAll(params: any): Promise<LeasingInsuranceCompany[]> {
    const where: any = {};
    const paginationOptions: any = getPaginationOptions(params);
    if (params.name) {
      where.name = params.name;
    }
    return this.DB.repo.LeasingInsuranceCompany.findAndCountAll({
      where,
      limit: paginationOptions.limit,
      offset: paginationOptions.offset,
      order: [['id', 'desc']],
    }
    );
  }
  

  async findById(id: number): Promise<LeasingInsuranceCompany> {
    return this.DB.repo.LeasingInsuranceCompany.findByPk(id);
  }

  async createLeasingInsuranceCompany(
    createDto: CreateLeasingInsuranceCompanyDto,
    loggedInUser: any,
  ): Promise<LeasingInsuranceCompany> {
    return this.DB.save('LeasingInsuranceCompany', createDto, loggedInUser);
  }


  async save(id: number, updateDto: UpdateLeasingInsuranceCompanyDto): Promise<LeasingInsuranceCompany> {
    return this.DB.repo.LeasingInsuranceCompany.update(updateDto, { where: { id } });
  }

  async delete(id: number): Promise<LeasingInsuranceCompany> {
    return this.DB.repo.LeasingInsuranceCompany.destroy({ where: { id } });
  }
}

