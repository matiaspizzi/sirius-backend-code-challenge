import { NodeMailgun } from 'ts-mailgun';
import dotenv from 'dotenv';

dotenv.config();
const mailer = new NodeMailgun();

mailer.apiKey = process.env['MAILGUN_API_KEY'] as string;
mailer.domain = process.env['MAILGUN_DOMAIN'] as string;
mailer.fromEmail = 'matias.nahuel.pii2@gmail.com';
mailer.fromTitle = 'Sirius Challenge';
mailer.init();

const sendMailgun = async (to: string, subject: string, body: string): Promise<boolean> => {
    try {
        await mailer.send(to, subject, body);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
};

export default sendMailgun;
