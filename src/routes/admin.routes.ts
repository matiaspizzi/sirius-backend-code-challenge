import express from 'express';
import adminService from '../services/admin.services';

const router = express.Router();

router.get('/stats', async (req, res) => {
    return await adminService.getStats(req, res);
});

export default router;
