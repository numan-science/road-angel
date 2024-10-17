import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { BASE_URL } from 'src/constants';
import { GlobalDbService } from '../global-db/global-db.service';
import * as sequelize from 'sequelize';
import * as _ from 'lodash';
const { Op } = sequelize;

@Injectable()
export class UserContextService {
  private logger = new Logger('UserContextService');
  private isActiveWhere = { isActive: true };

  constructor(private readonly DB: GlobalDbService) {}

  async getUserContext(loggedInUser: any): Promise<any> {
    const userData = loggedInUser.user;
    try {
      const cUserPromise = this.getUserDetails(userData);
      const permissionsPromise = this.getUserRolePermissions(userData);

      const [cUser, authority] = await Promise.all([
        cUserPromise,
        permissionsPromise,
      ]);

      const isSuperAdmin = !_.isEmpty(cUser.SuperUser);
      const isCompanyAdmin = !_.isEmpty(cUser.CompanyAdmin);

      const uC: any = {
        user: {
          id: cUser.id,
          username: cUser.username,
          email: cUser.email,
          phone: cUser.phone,
          profilePic: cUser.profilePic,
          passwordResetAt: cUser.passwordResetAt,
          roleId: cUser.roleId,
          authority,
          Role: cUser.Role,
          UserRegion: cUser.UserRegion,
        },
        baseUrl: BASE_URL,
        isSuperAdmin,
        isCompanyAdmin,
      };

      return uC;
    } catch (e) {
      if (e.response && e.response.error == 'Unauthorized') {
        throw new UnauthorizedException('user is in-active');
      } else {
        this.logger.error('Error occured while getUserContext ', e);
        throw new InternalServerErrorException();
      }
    }
  }

  async getUserDetails(user: any): Promise<any> {
    const { repo } = this.DB;
    const { id } = user;
    try {
      const cUser = await repo.User.findOne({
        where: { id },
        attributes: [
          'id',
          'username',
          'email',
          'phone',
          'profilePic',
          'isActive',
          'roleId',
        ],
        include: [
          {
            model: repo.Role,
            attributes: ['id', 'name'],
            required: false,
          },
          {
            model: repo.SuperUser,
            as: 'SuperUser',
            required: false,
            where: this.isActiveWhere,
            attributes: ['id'],
          },
          {
            model: repo.UserRegion,
            attributes: ['id', 'regionId', 'userId'],
          },
        ],
      });
      if (cUser && cUser.getDataValue('isActive')) {
        return cUser;
      } else {
        throw new UnauthorizedException('user is in-active');
      }
    } catch (e) {
      if (e.response && e.response.error == 'Unauthorized') {
        throw new UnauthorizedException('user is in-active');
      } else {
        this.logger.error('Error occured while getUserDetails ', e);
        throw new InternalServerErrorException();
      }
    }
  }

  async getUserRolePermissions(user: any): Promise<any> {
    const { repo } = this.DB;
    try {
      let permissions = await repo.Permission.findAll({
        where: this.isActiveWhere,
        attributes: ['permission'],
        include: [
          {
            model: repo.RolePermission,
            required: true,
            attributes: [],
            include: [
              {
                model: repo.Role,
                where: this.isActiveWhere,
                required: true,
                attributes: [],
                include: [
                  {
                    model: repo.User,
                    where: { id: user.id },
                    required: true,
                    attributes: [],
                  },
                ],
              },
            ],
          },
        ],
      });

      permissions = _.map(permissions, 'permission');
      return permissions;
    } catch (e) {
      this.logger.error('Error occured while getUserRolePermissions ', e);
      throw new InternalServerErrorException();
    }
  }
}
