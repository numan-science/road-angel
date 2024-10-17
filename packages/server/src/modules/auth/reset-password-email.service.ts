import {
  Injectable,
  Inject,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import * as _ from 'lodash'
import { BASE_URL, CLIENT_URL } from 'src/constants';
import { REPOSITORIES } from 'src/constants/repositories';
import { User } from '../../modules/user/entities/user.entity';
const pug = require('pug');
const path = require('path');
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const inlineCss = require('inline-css');

const emailConfig = {
  HOST: process.env.EMAIL_HOST,
  PORT: process.env.EMAIL_PORT,
  USER: process.env.EMAIL_USER,
  PASSWORD: process.env.EMAIL_PASSWORD,
};

const emailErrorMsg = 'Error occured while sending reset password email';

@Injectable()
export class ResetPasswordEmailService {
  private logger = new Logger('ResetPasswordEmailService');
  constructor(
    @Inject(REPOSITORIES.USER_REPOSITORY)
    private readonly userRepository: typeof User,
  ) {}

  async sendResetPasswordEmail(
    resetRequest: any,
    userId: number,
  ): Promise<void> {
    try {
      const userProfile = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (userProfile) {
        const params = {
          to: userProfile.email,
          subject: `Reset password request at SIC`,
          html: pug.renderFile(
            `${path.resolve()}/src/views/forgotPassword.pug`,
            {
              baseUrl: BASE_URL,
              clientUrl: CLIENT_URL,
              userProfile,
              resetRequest,
              moment,
              appClientName: '',
              _,
            },
          ),
        };

        this.sendViaNodeMailer(params);
      }
    } catch (e) {
      this.logger.error('Error occured while creating reset password email', e);
      throw new Error(e.message);
    }
  }

  async setInlineHtml(html: any) {
    return inlineCss(html, { url: BASE_URL });
  }

  async sendViaNodeMailer(params: any) {
    try {
      const html = await this.setInlineHtml(params.html);
      const nmMail = nodemailer.createTransport({
        name: emailConfig.HOST,
        host: emailConfig.HOST,
        port: emailConfig.PORT,
        secure: true,
        auth: { user: emailConfig.USER, pass: emailConfig.PASSWORD },
      });
      const mail = {
        from: emailConfig.USER,
        to: params.to,
        subject: params.subject,
        html,
        attachments: params.attachments || null,
      };
      nmMail.sendMail(mail).catch((err) => {
        this.logger.error(emailErrorMsg, err);
        throw new InternalServerErrorException(emailErrorMsg);
      });
    } catch (e) {
      this.logger.error(emailErrorMsg, e);
      throw new InternalServerErrorException(emailErrorMsg);
    }
  }
}
