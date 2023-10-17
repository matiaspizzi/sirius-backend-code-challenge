import dotenv from 'dotenv';
import { NodeMailgun } from 'ts-mailgun';
import { Mail, User } from '../types';
import sgMail from '@sendgrid/mail';
import { updateUserQuota } from '../repositories/user.repositories';
import { newMail } from '../repositories/mail.repositories';

dotenv.config();
sgMail.setApiKey(process.env['SENDGRID_API_KEY'] as string);

const mg = new NodeMailgun();
mg.apiKey = process.env['MAILGUN_API_KEY'] as string;
mg.domain = process.env['MAILGUN_DOMAIN'] as string;
mg.fromEmail = process.env['EMAIL_FROM'] as string;
mg.fromTitle = 'Sirius Challenge';
mg.init();

interface MailSender {
    sendMail(mail: Mail): Promise<boolean>;
}

class MailgunMailSender implements MailSender {
    async sendMail(mail: Mail): Promise<boolean> {
        try {
            await mg.send(mail.to, mail.subject, mail.body);
            return true;
        } catch (err) {
            return false;
        }
    }
}

class SendgridMailSender implements MailSender {
    async sendMail(mail: Mail): Promise<boolean> {
        try {
            const msg = {
                to: mail.to,
                from: process.env['EMAIL_FROM'] as string,
                subject: mail.subject,
                text: mail.body,
            };
            const res = await sgMail.send(msg);
            if (res[0].statusCode !== 202) return false;
            return true;
        } catch (err) {
            return false;
        }
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

class HandleMailRequest {
    private mailContext: MailContext;

    constructor(mailContext: MailContext) {
        this.mailContext = mailContext;
    }

    async handle(user: User, mail: Mail): Promise<boolean> {
        let mailSent = await this.mailContext.sendMail(mail);
        if (!mailSent) this.mailContext.setSender(new SendgridMailSender());
        mailSent = await this.mailContext.sendMail(mail);
        if (!mailSent) return false;
        await updateUserQuota(user.id, user.quota + 1);
        await newMail(user, mail.to, mail.subject, mail.body);
        return true;
    }
}


export { MailgunMailSender, SendgridMailSender, MailContext, HandleMailRequest };
