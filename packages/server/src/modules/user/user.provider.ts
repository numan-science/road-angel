import { User } from './entities/user.entity';
import { SuperUser } from './entities/super-user.entity';
import { REPOSITORIES } from 'src/constants/repositories';

export const userProvider = [
  {
    provide: REPOSITORIES.USER_REPOSITORY,
    useValue: User,
  },
  {
    provide: REPOSITORIES.SUPER_USER_REPOSITORY,
    useValue: SuperUser,
  },
];