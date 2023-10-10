import { updateUserQuota } from '../repositories/user.repositories';
import { newMail } from '../repositories/mail.repositories';
import sendMailgun from '../utils/mailgun.utils';
import sendSendgrid from '../utils/sendgrid.utils';
import { User, Mail } from '../types';
class mailService {
    async send(user: User, to: string, subject: string, body: string): Promise<{msg: string} | Mail> {
        if (`${user.lastQuotaCheck}` !== new Date().toLocaleDateString()) {
            const userUpdated = await updateUserQuota(user.id, 0);
            if (!userUpdated) return { msg: 'Usuario no encontrado' };
        }
        if (user.quota >= 1000)
            return { msg: 'Limite de cuota diaria alcanzado' };

        if (!to || !subject || !body)
            return { msg: 'Comprobar campos' };

        let sended = await sendMailgun(to, subject, body);
        if (!sended) sended = await sendSendgrid(to, subject, body);
        if (!sended) return { msg: 'error de servidor' };
        const mail = await newMail(user, to, subject, body);
        if (mail) return mail;
        return { msg: 'error de servidor' };
    }
}

const service = new mailService();

export default service;
