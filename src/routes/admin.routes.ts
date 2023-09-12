import express from 'express';
import { getUsersStats } from '../controllers/user.controller';
const router = express.Router();

router.get('/stats', async (_req, res) => {
    const data = await getUsersStats();
    if (!data) return res.status(500).json({ error: 'Error de servidor' });
    if (data?.length === 0) return res.status(404).json({ msg: 'No se encontraron usuarios' });
    return res.status(200).json(data);
});

export default router;
