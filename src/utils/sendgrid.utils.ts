import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
sgMail.setApiKey(process.env['SENDGRID_API_KEY'] as string);

const sendSendgrid = async (to: string, subject: string, body: string): Promise<boolean> => {
    try {
        const msg = {
            to,
            from: process.env['EMAIL_FROM'] as string,
            subject,
            text: body,
        };
        const res = await sgMail.send(msg);
        if (res[0].statusCode !== 202) return false;
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
};

export default sendSendgrid;
