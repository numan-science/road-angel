import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Op, Transaction } from 'sequelize';
import { GlobalDbService } from '../global-db/global-db.service';

const helpers = require('../../helpers');
const _ = require('lodash');

@Injectable()
export class RoleService {
  private logger = new Logger('RoleService');

  constructor(private readonly DB: GlobalDbService) {}

  saveRole = async (
    body: any,
    loggedInUser: any,
    transaction: Transaction = null,
  ) => {
    if (!body.id) {
      const response = await this.DB.getOne('Role', { name: body.name });
      if (response) {
        throw new ConflictException('Role already exists!');
      }
    }

    const savedRole = await this.DB.save(
      'Role',
      body,
      loggedInUser,
      transaction,
    );
    return savedRole
  }

  async saveRolePermissions(permissionsData: any, roleId: string) {
    try {
      const permissionIds = _.uniq(permissionsData.permissionIds);

      const validPermissions = await this.DB.getAll('Permission', {
        id: permissionIds,
      });
      if (validPermissions.rows.length !== permissionIds.length) {
        throw new Error('Invalid roles are passed.');
      }

      const rolePermissions = await this.DB.repo.RolePermission.findAll({
        where: { roleId },
        attributes: ['permissionId'],
      });

      const sentPermissions = permissionIds || [];

      const existingPermissions = [];
      _.map(rolePermissions, (v) => existingPermissions.push(v.permissionId));

      const addRoles = _.map(
        _.difference(sentPermissions, existingPermissions),
        (pId) => ({
          roleId,
          permissionId: pId,
        }),
      );

      const deleteRoles = _.map(
        _.difference(existingPermissions, sentPermissions),
        (pId) => ({
          roleId,
          permissionId: pId,
        }),
      );

      let permissionsToAdd = [];
      let permissionsToDelete = [];

      permissionsToAdd = [...permissionsToAdd, ...addRoles];
      permissionsToDelete = [...permissionsToDelete, ...deleteRoles];

      const addPromise =
        this.DB.repo.RolePermission.bulkCreate(permissionsToAdd);
      const deletePromise = this.DB.repo.RolePermission.destroy({
        where: {
          [Op.or]: permissionsToDelete,
        },
      });
      await Promise.all([addPromise, deletePromise]);
      return {
        message: 'Role Permissions set!',
        permissionsAdded: permissionsToAdd,
        permissionsDeleted: permissionsToDelete,
      };
    } catch (e) {
      this.logger.error('Error while creating Role-Permissions ', e);
    }
  }

  async getAll(query: any) {
    try {
      
      const roles = await this.DB.repo.Role.findAll();
      return roles;
    } catch (error) {
      this.logger.error(`Error fetching roles: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch roles.');
    }
  }

  async getOne(id: string) {
    try {
      
      const role = await this.DB.repo.Role.findByPk(id)
;
      if (!role) {
        throw new NotFoundException('Role not found.');
      }

      return role;
    } catch (error) {
      // Handle any errors during the fetch operation
      this.logger.error(`Error fetching role: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch role.');
    }
  }

  async getRolePermission(roleId: string, query: string) {
    try {
      const response = await this.DB.repo.RolePermission.findAll({
        where: { roleId },
        attributes: ['permissionId'],
        include: [
          {
            model: this.DB.repo.Permission,
            attributes: ['permission'],
          },
          {
            model: this.DB.repo.Role,
            attributes: [],
            required: true,
          },
        ],
      });
      return response;
      
    } catch (error) {
      // Handle any errors during the fetch operation
      this.logger.error(`Error fetching role permissions: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch role permissions.');
    }
  }

  async delete(id: string, loggedInUser: any, transaction: Transaction) {
    try {
      
      const role = await this.DB.repo.Role.findOne({ where :{id}})
      if (!role) {
        throw new NotFoundException('Role not found.');
      }

      await role.destroy({ transaction });

      return { message: 'Role deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting role: ${error.message}`);
      throw new InternalServerErrorException('Failed to delete role.');
    }
  }

  async search(params: any) {
    try {
      
      const roles = await this.DB.repo.Role.findAll({
        where: {
          name: {
            [Op.like]: `%${params.search}%`,
          },
        },
      });

      return roles;
    } catch (error) {
      this.logger.error(`Error searching roles: ${error.message}`);
      throw new InternalServerErrorException('Failed to search roles.');
    }
  }
}

