import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as dayjs from 'dayjs';
import { Op, Sequelize } from 'sequelize';
import {
  DATE_TIME_FORMAT, UNIQUE_KEY_VIOLATION
} from 'src/constants';
import { getPaginationOptions } from 'src/helpers/seql';
import { GlobalDbService } from '../global-db/global-db.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');
  constructor(private readonly DB: GlobalDbService) {}

  getAll = async (params: any, loggedInUser: any) => {
    const { repo } = this.DB;
    const paginationOptions: any = getPaginationOptions(params);
    const where: any = {};

    if (params.userId) {
      where.id = params.userId;
    }

    if (params.startDate && params.startDate !== 'null' && !params.endDate) {
      const startDate = dayjs(new Date(params.startDate))
        .startOf('day')
        .format(DATE_TIME_FORMAT);
      where.createdAt = {
        [Op.gte]: startDate,
      };
    }

    if (params.endDate && params.endDate !== 'null' && !params.startDate) {
      const endDate = dayjs(new Date(params.endDate))
        .endOf('day')
        .format(DATE_TIME_FORMAT);

      where.createdAt = {
        [Op.lte]: endDate,
      };
    }
    if (
      params.startDate &&
      params.endDate &&
      params.startDate !== 'null' &&
      params.endDate !== 'null'
    ) {
      const startDate = dayjs(new Date(params.startDate))
        .startOf('day')
        .format(DATE_TIME_FORMAT);
      const endDate = dayjs(new Date(params.endDate))
        .endOf('day')
        .format(DATE_TIME_FORMAT);
      where.createdAt = {
        [Op.and]: [
          {
            [Op.gte]: startDate,
          },
          {
            [Op.lte]: endDate,
          },
        ],
      };
    }

    const response = await repo.User.findAndCountAll({
      where,
      subQuery: false,
      limit: paginationOptions.limit,
      offset: paginationOptions.offset,
      attributes: [
        'id',
        'username',
        'email',
        'profilePic',
        'roleId',
        'createdAt',
        [Sequelize.col('Role.name'), 'role'],
      ],
      include: [
        {
          model: repo.Role,
          as: 'Role',
          attributes: [],
          required: true,
        },
        {
          model: repo.UserRegion,
          as: 'UserRegion',
          attributes: ['id', 'regionId', 'userId'],
          required: true,
          include: [
            {
              model: repo.Region,
              as: 'Region',
              attributes: ['id', 'name'],
              required: true,
            },
          ],
        },
      ],
      order: [['createdAt', 'desc']],
    });

    return response;
  };
  async save(user: any, loggedInUser: any) {
    const { email, password, role, regionId } = user;

    if (!email) {
      throw new BadRequestException('Email is required.');
    }

    if (!user?.id) {
      const userWhere: any = {};
      userWhere.email = email;
  
      const existingUser = await this.DB.getOne('User', userWhere);
      if (existingUser) {
        throw new ConflictException('UserEmail already exists.');
      }
      user.salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, user.salt);

      const response = await this.DB.getOne('Role', {
        name: role,
      });

      user.roleId = response.id;
    }

    try {
      const savedUser = await this.DB.save('User',user,loggedInUser)

      await this.addRegionUsers(savedUser.id, regionId, loggedInUser);

      return savedUser;
    } catch (error) {
      if (error?.parent?.code === UNIQUE_KEY_VIOLATION) {
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  addRegionUsers = async (
    userId: string,
    regionIds: any,
    loggedInUser: any,
  ) => {
    await this.DB.repo.UserRegion.destroy({where :{ userId }, force :true})

    for (const region of regionIds) {

      const UserRegions = {
        regionId: region,
        userId,
      };

      await this.DB.save('UserRegion', UserRegions, loggedInUser);
    }
  };

  update = async (body: any, loggedInUser: any, id: string) => {
    body.id = id;
    return this.DB.save('User', body, loggedInUser);
  };

  async delete(id: number): Promise<User> {
    return this.DB.repo.User.destroy({ where: { id } });
  }

  userLoginFirstTime = async (loggedInUser: any) => {
    const { repo } = this.DB;
    const response = await repo.LoginToken.count({
      where: { userId: loggedInUser.user.id },
    });

    return { isFirstTime: response === 1 };
  };

  updatePassword = async (body: any, loggedInUser: any) => {
    const { repo } = this.DB;
    const credentials = {
      id: loggedInUser.user.id,
      password: body.currentPassword,
    };
    const user = await this.validateUserPassword(credentials);

    if (user) {
      const newPassword = await bcrypt.hash(body.newPassword, user.salt);

      if (user.password !== newPassword) {
        const update = {
          password: newPassword,
          passwordResetAt: dayjs(dayjs()).add(1, 'month').toDate(),
        };
        await repo.User.update(update, {
          where: { id: loggedInUser.user.id },
        });

        return { message: 'Password updated!' };
      }
      throw new BadRequestException(
        'You used an old password. To protect your account, choose a new password.',
      );
    } else {
      throw new BadRequestException('Invalid current password');
    }
  };

  async validateUserPassword(userDto: any) {
    const { id, password } = userDto;
    const user = await this.DB.repo.User.scope('withPassword').findOne({
      where: { id },
    });

    if (user) {
      const hash = await bcrypt.hash(password, user.salt);
      if (hash === user.password) {
        return user;
      }
    }
    return null;
  }

  searchUser = async (params: any) => {
    const { repo } = this.DB;
    const where: any = {};
    const InsuranceCompanyWhere: any = {};
    if (params.search) {
      where.username = { [Op.iLike]: `%${params.search}%` };
    }

    if (params.insuranceCompanyId) {
      InsuranceCompanyWhere.companyId = params.insuranceCompanyId;
    }

    const response = await repo.User.findAll({
      where,
      include: [
        {
          model: repo.Role,
          as: 'UserRole',
          attibutes: ['id', 'name'],
        },
        {
          model: repo.InsuranceCompanyUser,
          attibutes: [],
          where: InsuranceCompanyWhere,
          required: true,
        },
      ],
    });
    return response;
  };
}
