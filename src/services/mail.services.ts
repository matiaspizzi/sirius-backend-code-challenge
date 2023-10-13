import { Mail } from '../types';
import sendMailgun from '../utils/mailgun.utils';
import sendSendgrid from '../utils/sendgrid.utils';

interface MailSender {
    sendMail(mail: Mail): Promise<boolean>;
}

class MailgunMailSender implements MailSender {
    async sendMail(mail: Mail): Promise<boolean> {
        return await sendMailgun(mail.to, mail.subject, mail.body);
    }
}

class SendgridMailSender implements MailSender {
    async sendMail(mail: Mail): Promise<boolean> {
        return await sendSendgrid(mail.to, mail.subject, mail.body);
    }
}

class MailContext {
    private sender: MailSender;

    constructor(sender: MailSender) {
        this.sender = sender;
    }

    setSender(sender: MailSender) {
        this.sender = sender;
    }

    async sendMail(mail: Mail): Promise<boolean> {
        return await this.sender.sendMail(mail);
    }
}


export { MailgunMailSender, SendgridMailSender, MailContext };
