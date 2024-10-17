import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Op, Transaction } from 'sequelize';
import {
  DATE_TIME_FORMAT,
  DEFAULT_ROLES,
  UNIQUE_KEY_VIOLATION,
} from 'src/constants';
import { getPaginationOptions } from 'src/helpers/seql';
import { GlobalDbService } from '../global-db/global-db.service';
import { CreateInsuranceCompanyUserDto } from './dto/create-insurance-company-user.dto';
import { InsuranceCompanyUser } from './entities/insurance-companies-user.entity';
const _ = require('lodash');
const dayjs = require('dayjs');
const bcrypt = require('bcryptjs');

@Injectable()
export class InsuranceCompanyUserService {
  
  
  private logger = new Logger('InsuranceCompanyUserService');
  constructor(private readonly DB: GlobalDbService) {}

  getAll = async (params: any, loggedInUser: any) => {
    const { repo } = this.DB;
    const paginationOptions: any = getPaginationOptions(params);
    const insuranceCompanyWhere: any = {};
    const where: any = {};

    if (loggedInUser.user?.insuranceompany?.id) {
      insuranceCompanyWhere.id = loggedInUser.user?.insuranceCompany?.id;
    }

 

    if (params.insuranceCompanyId) {
      where.insuranceCompanyId = params.insuranceCompanyId;
    }

    if (params.userId) {
      where.userId = params.userId;
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

    const response = await repo.insuranceCompanyUser.findAndCountAll({
      where,
      subQuery: false,
      distinct: true,
      limit: paginationOptions.limit,
      offset: paginationOptions.offset,
      include: [
        {
          model: repo.User,
          attributes: ['id', 'username', 'email', 'profilePic'],
          required: true,
          include: {
            model: repo.Role,
            as: 'UserRole',
            attributes: ['id', 'name'],
            required: true,
          },
        },
        
        
        {
          model: repo.InsuranceCompany,
          attributes: ['id', 'name'],
          where: insuranceCompanyWhere,
          required: true,
        },
      ],
      order: [['createdAt', 'desc']],
    });

    return response;
  };

  saveinsuranceCompanyUser = async (
    data: any,
    loggedInUser: any,
    transaction: Transaction = null,
  ) => {
    const { user, companyUser = {}, clientIds } = data;

    if (!InsuranceCompanyUser.id) {
      const response = await this.DB.getOne('User', {
        username: user.username,
      });
      if (response) {
        throw new ConflictException('Username or Email already exists!');
      }
    }

    try {
      if (!user.id) {
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, user.salt);
      }

      let savedUser: any = {};
      try {
        savedUser = await this.DB.save('User', user, loggedInUser, transaction);
      } catch (error) {
        if (error?.parent?.code === UNIQUE_KEY_VIOLATION) {
          throw new ConflictException('Username or Email already exists!');
        } else {
          throw new InternalServerErrorException();
        }
      }

      InsuranceCompanyUser.userId = savedUser.id;
      const savedinsuranceCompanyUser = await this.DB.save(
        'InsuranceCompanyUser',
        InsuranceCompanyUser,
        loggedInUser,
        transaction,
      );

      await this.assignClients(
        { companyUserId: savedinsuranceCompanyUser.id, clientIds },
        loggedInUser,
        transaction,
      );
    } catch (error) {
      throw new ConflictException(error.message);
    }

    return {
      message: `Insurance Company User ${InsuranceCompanyUser.id ? 'updated' : 'created'}!`,
    };
  };

  assignClients = async (
    data: any,
    loggedInUser: any,
    transaction: Transaction = null,
  ) => {
    const { repo } = this.DB;
    await repo.ClientAssignedUser.destroy({
      where: _.pick(data, ['insuranceCompanyUserId']),
      force: true,
    });

    for (let i = 0; i < data.clientIds.length; i++) {
      const client = data.clientIds[i];
      const assignedClient = {
        clientId: client.value,
        insuranceCompanyUserId: data.insuranceCompanyUserId,
      };
      await this.DB.save(
        'ClientAssignedUser',
        assignedClient,
        loggedInUser,
        transaction,
      );
    }
  };

  delete = async (
    insuranceCompanyUserId: string,
    loggedInUser: any,
    transaction: Transaction = null,
  ) => {
    await this.DB.delete(
      'ClientAssignedUser',
      { insuranceCompanyUserId },
      loggedInUser,
      transaction,
    );

    const InsuranceCompanyUser = await this.DB.getOne('InsuranceCompanyUser', {
      id: insuranceCompanyUserId,
    });
    const userId = InsuranceCompanyUser.userId;

    await this.DB.delete(
      'InsuranceCompanyUser',
      { id: InsuranceCompanyUser },
      loggedInUser,
      transaction,
    );

    await this.DB.delete('User', { id: userId }, loggedInUser, transaction);

    return { message: 'Company User deleted!' };
  };
}
