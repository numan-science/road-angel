import { Injectable } from '@nestjs/common';
import { Region } from './entities/region.entity';
import { CreateRegionDto, UpdateRegionDto } from './dto/region.dto';
import { GlobalDbService } from '../global-db/global-db.service';
import { getPaginationOptions } from 'src/helpers/seql';

@Injectable()
export class RegionService {
  constructor(private readonly DB: GlobalDbService) {}

  async findAll(params: any, loggedInUser: any): Promise<Region[]> {
    const where: any = {};
    const paginationOptions: any = getPaginationOptions(params);
    if (params.regionId) {
      where.id = params.regionId;
    }
    return this.DB.repo.Region.findAndCountAll({
      where,
      limit: paginationOptions.limit,
      offset: paginationOptions.offset,
      order: [['id', 'desc']],
    });
  }

  async findById(id: number): Promise<Region> {
    return this.DB.repo.Region.findByPk(id);
  }

  async create(createDto: CreateRegionDto, loggedInUser: any): Promise<Region> {
    return this.DB.save('Region', createDto, loggedInUser);
  }

  async update(
    id: number,
    updateDto: UpdateRegionDto,
  ): Promise<[number, Region[]]> {
    return this.DB.repo.Region.update(updateDto, { where: { id } });
  }

  async delete(id: number): Promise<number> {
    return this.DB.repo.Region.destroy({ where: { id } });
  }
}
