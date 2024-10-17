import { UnauthorizedException } from '@nestjs/common';

const moment = require('moment-timezone');

export class Validate {
  constructor() {}
  async token(tokenDetail: any) {
    if (!tokenDetail) {
      throw new UnauthorizedException('Token expired');
    }
    const checkedAt = moment();
    const expiredAt = moment(tokenDetail.expiredAt);
    if (checkedAt > expiredAt) {
      throw new UnauthorizedException('Token expired');
    }
    return true;
  }
}
