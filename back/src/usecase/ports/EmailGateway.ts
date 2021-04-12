export interface EmailGateway {
    sendEmail(sender: string, recipients: string, object: string, body: string): void;
}
