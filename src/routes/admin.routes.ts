import express from 'express';
import { adminGetStats } from '../services/admin.services';

const router = express.Router();

router.get('/stats', async (req, res) => {
    return await adminGetStats(req, res);
});

export default router;
