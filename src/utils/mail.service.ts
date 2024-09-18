import * as nodemailer from 'nodemailer';
import Constants from './Constants';
import { Injectable } from '@nestjs/common';

export type EmailOptions = {
  to: string;
  subject: string;
  html: string;
};

@Injectable()
export default class MailService {
  transporter: any;
  constructor() {
    this.transporter = nodemailer.createTransport({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      host: Constants.MAIL_HOST,
      port: Constants.MAIL_PORT,
      auth: {
        user: Constants.MAIL_USER,
        pass: Constants.MAIL_PASSWORD,
      },
      defaults: {
        from: Constants.MAIL_USER,
      },
    });
  }
  async sendMail(mailOptions: EmailOptions) {
    return await this.transporter.sendMail(mailOptions).catch(console.error);
  }
}
