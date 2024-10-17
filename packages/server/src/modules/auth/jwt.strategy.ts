import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../user/entities/user.entity';
import { JWT_SECRET_KEY } from '../../constants';
import { REPOSITORIES } from 'src/constants/repositories';
import { UserContextService } from './user-context.service';
import * as moment from 'moment-timezone';
import { Op } from 'sequelize';
import { GlobalDbService } from '../global-db/global-db.service';

const jwtExtractor = (req) => {
  let token = null;
  if (req?.headers) {
    const tokenParts = req.headers?.authorization?.split('Bearer ');
    if (tokenParts?.[1]) {
      token = tokenParts[1];
      global.jwtToken = token;
    }
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(REPOSITORIES.USER_REPOSITORY)
    private readonly userRepository: typeof User,
    private readonly userContextService: UserContextService,
    private readonly DB: GlobalDbService,
  ) {
    super({
      jwtFromRequest: jwtExtractor,
      secretOrKey: JWT_SECRET_KEY,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { repo } = this.DB;
    try {
      const now = moment().toDate();
      const loggedInUser = await this.userRepository.findOne({
        include: [
          {
            model: repo.LoginToken,
            where: {
              token: global.jwtToken,
              expiredAt: { [Op.gte]: now },
            },
            attributes: [],
          },
        ],
      });

      if (!loggedInUser) {
        throw new ForbiddenException();
      }

      const userContext = await this.userContextService.getUserContext({
        user: loggedInUser,
      });

      return userContext;
    } catch (e) {
      throw new ForbiddenException();
    }
  }
}
