import express from 'express';
import { MailgunMailSender, SendgridMailSender, MailContext } from '../services/mail.services';
import { Mail } from '../types';
import { updateUserQuota } from '../repositories/user.repositories';
import { newMail } from '../repositories/mail.repositories';

const router = express.Router();

router.post('/send', async (req, res) => {
    const {to, subject, body} = req.body;
    if (!to || !subject || !body) return res.status(400).json({error: 'Faltan datos'});
    const user = res.locals['user'];
    const mail = {authorId: user.id, to, subject, body} as Mail;
    const mailService = new MailContext(new MailgunMailSender());
    const resp = await mailService.sendMail(mail);
    if (resp) {
        newMail(user, to, subject, body);
        updateUserQuota(user.id, user.quota + 1);
        return res.status(201).json({...mail, id: user.id});
    }
    else {
        mailService.setSender(new SendgridMailSender());
        const resp2 = await mailService.sendMail(mail);
        if (resp2) {
            newMail(user, to, subject, body);
            updateUserQuota(user.id, user.quota + 1);
            return res.status(201).json({...mail, id: user.id});
        }
        return res.status(400).json(resp);
    }
});

export default router; 
