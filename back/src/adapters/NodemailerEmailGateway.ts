import { EmailGateway } from "../usecase/ports/EmailGateway";
import nodemailer from "nodemailer";
import config from "../config";

export class NodemailerEmailGateway implements EmailGateway {
  async sendEmail(
    recipients: string,
    subject: string,
    body: string
  ): Promise<void> {
    if (!process.env.SMTP_HOST) {
      return;
    }
    // create transporter to send email to AWS SES instance
    const options = {
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT),
      secure: getBoolean(process.env.SMTP_SECURE),
      ignoreTLS: getBoolean(process.env.SMTP_IGNORE_TLS),
      auth: null
    };
    if (process.env.SMTP_USER) {
      options.auth = {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      };
    }
    const transporter = nodemailer.createTransport(options);

    // prepare mail info and content
    const mailOptions = {
      from: config.emailFrom,
      to: recipients,
      subject: subject,
      text: body
    };

    // send email
    try {
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (err) {
      console.error(`Error trying to send email to ${recipients} : ${err}`);
      throw err;
    }
  }
}

function getBoolean(s: string): boolean {
  return s == "true";
}
