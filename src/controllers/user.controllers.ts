import express from 'express';
import userService from '../services/user.services';
import { User } from '../types';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    const resp = await userService.register(username, password, role);
    if (<User>resp) return res.status(201).json(resp);
    return res.status(500).json(resp);
});

router.post('/login', async (req, res) => {
    const { username, login } = req.body;
    const resp = await userService.login(username, login);
    if (<{token: string, user: User}>resp) return res.status(200).json(resp);
    return res.status(500).json(resp);
});

export default router;
