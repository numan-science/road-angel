import { LoginToken } from './entities/login-token.entity';
import { ForgotPassword } from './entities/forgot-password.entity';
import { REPOSITORIES } from 'src/constants/repositories';

export const authProvider = [
  {
    provide: REPOSITORIES.LOGIN_TOKEN_REPOSITORY,
    useValue: LoginToken,
  },
  {
    provide: REPOSITORIES.FORGOT_PASSWORD_REPOSITORY,
    useValue: ForgotPassword,
  },
];
