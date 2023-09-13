import express from 'express';
import { userPostRegister, userPostLogin } from '../services/user.services';

const router = express.Router();

router.post('/register', async (req, res) => {
    return await userPostRegister(req, res);
});

router.post('/login', async (req, res) => {
    return await userPostLogin(req, res);
});

export default router;
