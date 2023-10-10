import express from 'express';
import adminService from '../services/admin.services';

const router = express.Router();

router.get('/stats', async (_req, res) => {
    const stats = adminService.getStats();
    if(stats == undefined) return res.status(500).json({error: 'Error de servidor'});
    return res.status(200).json(stats);
});

export default router;
