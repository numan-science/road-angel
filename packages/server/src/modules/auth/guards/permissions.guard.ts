import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ANY, ALL } from 'src/constants/permissions';
import * as _ from 'lodash'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const checkPermissions = this.reflector.get<any>(
      'checkPermissions',
      context.getHandler(),
    );

    if (checkPermissions) {
      const { user } = context.switchToHttp().getRequest();
      const { permissions, match } = checkPermissions;

      if (user.isSuperAdmin) {
        return true;
      }

      if (_.isEmpty(user.permissions)) {
        return true;
      }

      const userPermissions = _.filter(permissions, (p) =>
        _.includes(user.permissions, p),
      );

      if (match === ANY && userPermissions.length) {
        return true;
      } else if (
        match === ALL &&
        userPermissions.length === permissions.length
      ) {
        return true;
      }

      return false;
    }
    return true;
  }
}
