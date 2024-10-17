import { Injectable, Logger } from '@nestjs/common';
import { GlobalDbService } from '../global-db/global-db.service';
import _ from 'lodash';

import { Op } from 'sequelize';
@Injectable()
export class RolePermissionService {
  private logger = new Logger('RolePermissionService');
  constructor(private readonly DB: GlobalDbService) {}

  async getRolePermissions(roleId) {
    const rolePermissions = await this.DB.repo.RolePermission.findAndCountAll({
      where: { roleId },
      attributes: ['permissionId'],
      include: [
        {
          model: this.DB.repo.Permission,
          attributes: ['permission'],
        },
      ],
    });
    return rolePermissions;
  }

  async saveRolePermissions(permissionsData, roleId) {
    try {
      const permissionIds = _.uniq(permissionsData.permissionIds);

      const validPermissions = await this.DB.getAll('Permission', {
        id: permissionIds,
      });
      if (validPermissions.rows.length !== permissionIds.length) {
        throw new Error('Invalid roles are passed.');
      }

      const rolePermissions = await this.DB.repo.RolePermission.findAll({
        where: { roleId: roleId },
        attributes: ['permissionId'],
      });

      const sentPermissions = permissionIds || [];

      const existingPermissions = [];
      _.map(rolePermissions, (v) => existingPermissions.push(v.permissionId));

      const addRoles = _.map(
        _.difference(sentPermissions, existingPermissions),
        (pId) => ({
          roleId: roleId,
          permissionId: pId,
        }),
      );

      const deleteRoles = _.map(
        _.difference(existingPermissions, sentPermissions),
        (pId) => ({
          roleId: roleId,
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
        permissionsAdded: permissionsToAdd,
        permissionsDeleted: permissionsToDelete,
      };
    } catch (e) {
      this.logger.error('Error while creating Role-permissions ', e);
    }
  }
}