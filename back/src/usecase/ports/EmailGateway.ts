export interface EmailGateway {
  sendEmail(recipients: string, object: string, body: string): void;
}
