import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getUserById, updateUserQuota } from '../repositories/user.repositories';
import { newMail } from '../repositories/mail.repositories';
import sendMailgun from '../utils/mailgun.utils';
import sendSendgrid from '../utils/sendgrid.utils';

class mailService {
    async send(req: Request, res: Response): Promise<Response> {
        const token = req.headers['auth_token'] as string;
        if (!token)
            return res.status(401).json({ error: 'Se requiere token de autenticación' });
        const decoded = jwt.verify(token, process.env['JWT_SECRET'] as string) as JwtPayload;
        const user = await getUserById(parseInt(decoded['id']));
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        // Si el ultimo chequeo de cuota no es el dia de hoy, se resetea la cuota
        if (`${user.lastQuotaCheck}` !== new Date().toLocaleDateString()) {
            const userUpdated = await updateUserQuota(user.id, 0);
            if (!userUpdated) return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        if (user.quota >= 1000)
            return res.status(403).json({ error: 'Limite de cuota diaria alcanzado' });

        const { to, subject, body } = req.body;
        if (!to || !subject || !body)
            return res.status(400).json({ error: 'Comprobar campos' });

        let sended = await sendMailgun(to, subject, body);
        if (!sended) sended = await sendSendgrid(to, subject, body);
        if (!sended) return res.status(500).json({ error: 'Error de servidor' });
        const mail = await newMail(user, to, subject, body);
        if (mail) return res.status(201).json(mail);
        return res.status(500).json({ error: 'Error de servidor' });
    }
}

const service = new mailService();

export default service;
