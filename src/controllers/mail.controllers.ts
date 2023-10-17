import express from 'express';
import { MailgunMailSender, MailContext, HandleMailRequest } from '../services/mail.services';
import { Mail } from '../types';

const router = express.Router();

router.post('/send', async (req, res) => {
    const {to, subject, body} = req.body;
    const user = res.locals['user']
    if (!to || !subject || !body) return res.status(400).json({error: 'Error de campos'});
    const mailService = new HandleMailRequest(new MailContext(new MailgunMailSender()));
    const resolve = await mailService.handle(user, {authorId: user.id, to, subject, body} as Mail)
    if (resolve) return res.status(200).json({message: 'Correo enviado'});
    return res.status(400).json({error: 'No se pudo enviar el correo'});
});

export default router; 
