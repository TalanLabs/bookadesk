import { EmailGateway } from "../usecase/ports/EmailGateway";
import nodemailer from "nodemailer";

export class AwsEmailGateway implements EmailGateway {
  async sendEmail(
    sender: string,
    recipients: string,
    subject: string,
    body: string
  ): Promise<void> {
    // create transporter to send email to AWS SES instance
    const transporter = nodemailer.createTransport({
      host: process.env.SES_HOST,
      port: process.env.SES_PORT,
      secure: true,
      auth: {
        user: process.env.SES_SMTP_USER,
        pass: process.env.SES_SMTP_PASS
      }
    });

    // prepare mail info and content
    const mailOptions = {
      from: sender,
      to: recipients,
      subject: subject,
      text: body
    };

    // send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.info(
        `Email sent to ${recipients} by ${sender} with subject : ${subject}`
      );
      return info;
    } catch (err) {
      console.error(`Error trying to send email to ${recipients} : ${err}`);
      throw err;
    }
  }
}
