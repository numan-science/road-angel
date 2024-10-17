import { Injectable } from '@nestjs/common';
import { InsuranceDocuments } from './entities/insurance-documents.entity';
import {
  CreateInsuranceDocumetsDto,
  UpdateInsuranceDocumentsDto,
} from './dto/insurance-documents.dto';
import { GlobalDbService } from '../global-db/global-db.service';

@Injectable()
export class InsuranceDocumentsService {
  constructor(private readonly DB: GlobalDbService) {}

  async findAll(): Promise<InsuranceDocuments[]> {
    return this.DB.repo.InsuranceDocuments.findAndCountAll({
      include: [
        {
          model: this.DB.repo.InsuranceCompany,
          attributes: ['id', 'name', 'logo'],
        },
      ],
    });
  }

  async findById(id: number): Promise<InsuranceDocuments> {
    return this.DB.repo.InsuranceDocuments.findByPk(id);
  }

  async create(
    createDto: CreateInsuranceDocumetsDto,
  ): Promise<{ message: string }> {
    for (let i = 0; i < createDto?.length; i++) {
      const doc = createDto[i];

      const createdDocument = await this.DB.repo.InsuranceDocuments.create(doc);
    }
    return { message: 'successful' };
  }

  async save(
    id: number,
    updateDto: UpdateInsuranceDocumentsDto,
  ): Promise<InsuranceDocuments> {
    return this.DB.repo.InsuranceDocuments.update(updateDto, { where: { id } });
  }

  async delete(id: number): Promise<InsuranceDocuments> {
    return this.DB.repo.InsuranceDocuments.destroy({ where: { id } });
  }
}
