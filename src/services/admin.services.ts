import { getUsersStats } from '../repositories/user.repositories';
import { Request, Response } from 'express';

const adminGetStats = async (_req: Request, res: Response): Promise<Response> => {
    const data = await getUsersStats();
    if (!data) return res.status(500).json({ error: 'Error de servidor' });
    if (data?.length === 0) return res.status(404).json({ msg: 'No se encontraron usuarios' });
    return res.status(200).json(data);
};

export { adminGetStats };
