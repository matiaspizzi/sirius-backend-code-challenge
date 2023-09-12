import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { getUserById } from '../controllers/user.controller';

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['auth_token'] as string;
    if (!token)
        return res
            .status(401)
            .json({ error: 'Se requiere token de autenticación' });
    try {
        const decoded = jwt.verify(
            token,
            process.env['JWT_SECRET'] as string
        ) as JwtPayload;
        const user = await getUserById(parseInt(decoded['id']));
        if (!user) return res.status(404).json({error: 'Error de autenticación. Usuario no encontrado'});
        return next();
    } catch (err) {
        return res.status(401).json({ error: err });
    }
};

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['auth_token'] as string;
    if (!token)
        return res
            .status(401)
            .json({ error: 'Se requiere token de autenticación' });
    try {
        const decoded = jwt.verify(
            token,
            process.env['JWT_SECRET'] as string
        ) as JwtPayload;
        const user  = await getUserById(parseInt(decoded['id']));
        if (!user) return res.status(404).json({error: 'Error de autenticación. Usuario no encontrado'});
        if (user.role !== 'admin') {
            return res.status(403).json({
                error: 'Error de autenticación. Usuario no es administrador',
            });
        }
        return next();
    } catch (err) {
        return res.status(401).json({ error: err });
    }
};

export { userAuth, adminAuth };
