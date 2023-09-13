import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { saveUser, getUserByUsername } from '../repositories/user.repositories';
import { Request, Response } from 'express';

const userPostRegister = async (req: Request, res: Response) => {
    const { username, password, role } = req.body;
    if (!username || !password || (role !== undefined && role !== 'admin'))
        return res.status(400).json({ error: 'Comprobar campos' });
    try {
        const user = await getUserByUsername(username);
        if (user) return res.status(400).json({ error: 'El usuario ya está registrado' });
        const newUser = await saveUser(username, await bcrypt.hash(password, 10), role || 'user');
        if (!newUser) return res.status(500).json({ error: 'Error de servidor' });
        return res.status(201).json(newUser);
    } catch (err) {
        return res.status(500).json({ error: 'Error de servidor' });
    }
};

const userPostLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res
            .status(400)
            .json({ error: 'Se requiere usuario y contraseña' });
    try {
        const user = await getUserByUsername(username);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        const validPassword: boolean = await bcrypt.compare(
            password,
            user.password
        );
        if (!validPassword)
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        const token = jwt.sign(
            { id: user.id },
            process.env['JWT_SECRET'] as string,
            { expiresIn: '1h' }
        );
        return res.status(200).json({ token, user });
    } catch (err) {
        return res.status(500).json({ error: 'Error de servidor' });
    }
};

export { userPostRegister, userPostLogin };