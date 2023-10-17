import express from 'express';
import userService from '../services/user.services';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || (role !== undefined && role !== 'admin')) return res.status(400).json({error: 'Faltan datos'});
    const resp = await userService.register(username, password, role);
    if (typeof resp === 'object' && 'error' in resp) return res.status(400).json(resp);
    return res.status(201).json(resp);
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({error: 'Faltan datos'});
    const resp = await userService.login(username, password);
    if (typeof resp === 'object' && 'error' in resp) return res.status(400).json(resp);
    return res.status(200).json(resp);
});

export default router;
