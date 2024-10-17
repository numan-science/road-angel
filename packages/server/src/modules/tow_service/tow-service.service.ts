import { Injectable, Post } from '@nestjs/common';
import { TowService } from './entities/tow-service.entity';
import {
  CreateTowServiceDto,
  UpdateTowServiceDto,
} from './dto/tow-service.dto';
import { GlobalDbService } from '../global-db/global-db.service';
import { DEFAULT_ROLES } from 'src/constants';
import { Op } from 'sequelize';
import { getPaginationOptions } from 'src/helpers/seql';

@Injectable()
export class TowServiceService {
  constructor(private readonly DB: GlobalDbService) {}
  async findAll(loggedInUser: any, params: any): Promise<TowService[]> {
    console.log("params", params);
    const where: any = {};
    const paginationOptions: any = getPaginationOptions(params);
    if (params.name) {
      where.name = params.name;
    }

    const regionIds = loggedInUser?.user?.UserRegion?.map(
      (region) => region?.regionId,
    );
    // console.log("loggedInUser",JSON.stringify(loggedInUser,null,2));

    if (!loggedInUser?.isSuperAdmin) {
      where.regionId = { [Op.in]: regionIds };
    }

    return this.DB.repo.TowService.findAndCountAll({
      where,
      limit: paginationOptions.limit,
      offset: paginationOptions.offset,
      order: [['id', 'desc']],
      include: [
        {
          model: this.DB.repo.Region,
          required: true,
        },
        {
          model: this.DB.repo.User,
          required: true,
          include: [
            {
              model: this.DB.repo.Role,
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });
  }

  async findById(id: number): Promise<TowService> {
    return this.DB.repo.TowService.findByPk(id);
  }

  async create(
    createDto: CreateTowServiceDto,
    loggedInUser: any,
  ): Promise<TowService> {
    return this.DB.save('TowService', createDto, loggedInUser);
  }

  async update(
    id: number,
    updateDto: UpdateTowServiceDto,
  ): Promise<[number, TowService[]]> {
    return this.DB.repo.TowService.update(updateDto, { where: { id } });
  }

  async delete(id: number): Promise<number> {
    return this.DB.repo.TowService.destroy({ where: { id } });
  }
}
