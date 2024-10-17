import { Injectable } from '@nestjs/common';
import { Workshop } from './entities/workshop.entity';
import { CreateWorkshopDto, UpdateWorkshopDto } from './dto/workshop.dto';
import { GlobalDbService } from '../global-db/global-db.service';
import { DEFAULT_ROLES } from 'src/constants';
import { Op } from 'sequelize';
import { getPaginationOptions } from 'src/helpers/seql';

@Injectable()
export class WorkshopService {
  constructor(private readonly DB: GlobalDbService) {}

  async findAll(loggedInUser: any, params: any): Promise<Workshop[]> {
    const where: any = {};
    const paginationOptions: any = getPaginationOptions(params);
    if (params.name) {
      where.name = params.name;
    }
    const regionIds = loggedInUser?.user?.UserRegion?.map(
      (region) => region?.regionId,
    );

    if (!loggedInUser?.isSuperAdmin) {
      where.regionId = { [Op.in]: regionIds };
    }
    return this.DB.repo.Workshop.findAndCountAll({
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

  async findById(id: number): Promise<Workshop> {
    return this.DB.repo.Workshop.findByPk(id);
  }

  async create(
    createDto: CreateWorkshopDto,
    loggedInUser: any,
  ): Promise<Workshop> {
    return this.DB.save('Workshop', createDto, loggedInUser);
  }

  async save(
    updateDto: UpdateWorkshopDto,
    loggedInUser: any,
  ): Promise<Workshop> {
    return this.DB.save('Workshop', updateDto, loggedInUser);
  }

  async delete(id: number): Promise<Workshop> {
    return this.DB.repo.Workshop.destroy({ where: { id } });
  }
}
