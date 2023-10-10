import express from 'express';
import mailService from '../services/mail.services';

const router = express.Router();

router.post('/send', async (req, res) => {
    return await mailService.send(req, res);
});

export default router; 
