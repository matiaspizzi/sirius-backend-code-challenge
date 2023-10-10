import express from 'express';
import userService from '../services/user.services';

const router = express.Router();

router.post('/register', async (req, res) => {
    return await userService.register(req, res);
});

router.post('/login', async (req, res) => {
    return await userService.login(req, res);
});

export default router;
