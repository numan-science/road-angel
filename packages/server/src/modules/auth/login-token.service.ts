import {
  Injectable,
  Inject,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment-timezone';
import {
  JWT_TOKEN_EXPIRY_DEFAULT,
  JWT_TOKEN_EXPIRY_REMEMBER_ME,
  TOKEN_EXPIRY_DEFAULT,
  TOKEN_EXPIRY_REMEMBER_ME,
} from 'src/constants';
import { REPOSITORIES } from 'src/constants/repositories';
import { LoginToken } from './entities/login-token.entity';
import { UserContextService } from './user-context.service';

@Injectable()
export class LoginTokenService {
  private logger = new Logger('LoginTokenService');
  constructor(
    @Inject(REPOSITORIES.LOGIN_TOKEN_REPOSITORY)
    private readonly loginTokenRepository: typeof LoginToken,
    private jwtService: JwtService,
    @Inject(UserContextService)
    private readonly userContextService,
  ) {}

  async generateToken(user: any, clientInfo: any): Promise<any> {
    const { ip, userAgent, rememberMe } = clientInfo;
    const expiresAt =
      (rememberMe &&
        moment().add(TOKEN_EXPIRY_REMEMBER_ME, 'months').toDate()) ||
      moment().add(TOKEN_EXPIRY_DEFAULT, 'hours').toDate();

    const authSuccess = {
      user: {
        id: user.id,
        username: user.username,
      },
    };

    const token = this.jwtService.sign(authSuccess, {
      expiresIn: rememberMe
        ? JWT_TOKEN_EXPIRY_REMEMBER_ME
        : JWT_TOKEN_EXPIRY_DEFAULT,
    });

    const loginToken = new LoginToken();
    loginToken.userId = user.id;
    loginToken.ip = ip;
    loginToken.userAgent = userAgent;
    loginToken.expiredAt = expiresAt;
    loginToken.token = token;

    try {
      await loginToken.save();
    } catch (error) {
      this.logger.error('Error occured while saving loginToken ', error);
      throw new InternalServerErrorException();
    }

    const userContext: any = await this.userContextService.getUserContext({
      user,
    });

    const result = {
      ...userContext,
      token,
    };

    return result;
  }

  async expireToken(token: string): Promise<void> {
    const loginToken = await this.loginTokenRepository.findOne({
      where: { token },
    });
    if (token) {
      loginToken.expiredAt = moment().toDate();
      await loginToken.save();
    }
  }
}
