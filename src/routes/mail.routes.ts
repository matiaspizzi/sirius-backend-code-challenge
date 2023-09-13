import express from 'express';
import { mailPostSend } from '../services/mail.services';

const router = express.Router();

router.post('/send', async (req, res) => {
    return await mailPostSend(req, res);
});

export default router; 
