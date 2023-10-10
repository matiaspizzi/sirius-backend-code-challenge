import express from 'express';
import mailService from '../services/mail.services';
import { Mail } from '../types';

const router = express.Router();

router.post('/send', async (req, res) => {
    const {to, subject, body} = req.body;
    const user = res.locals['user'];
    const resp = await mailService.send(user, to, subject, body);
    if (<Mail>resp) return res.status(201).json(resp);
    return res.status(400).json(resp);
});

export default router; 
