import { Role } from './entities/role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { REPOSITORIES } from 'src/constants/repositories';

export const roleProvider = [
  {
    provide: REPOSITORIES.ROLE_PERMISSION_REPOSITORY,
    useValue: RolePermission,
  },
  {
    provide: REPOSITORIES.ROLE_REPOSITORY,
    useValue: Role,
  },
];
