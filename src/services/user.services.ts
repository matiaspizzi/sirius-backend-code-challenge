import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { saveUser, getUserByUsername } from '../repositories/user.repositories';
import { User } from '../types';

class userService {
    async register(username: string, password: string, role: string): Promise<User | {error: string}> {
        if (!username || !password || (role !== undefined && role !== 'admin'))
            return { error: 'Comprobar campos' };
        try {
            const user = await getUserByUsername(username);
            if (user) return { error: 'El usuario ya está registrado' };
            const newUser = await saveUser(
                username,
                await bcrypt.hash(password, 10),
                role || 'user'
            );
            if (!newUser) return { error: 'Error de servidor' };
            return newUser;
        } catch (err) {
            return { error: 'Error de servidor' };
        }
    }

    async login(username: string, password: string): Promise<{error: string} | { token: string, user: User }> {
        if (!username || !password)
            return { error: 'Se requiere usuario y contraseña' };
        try {
            const user = await getUserByUsername(username);
            if (!user) return { error: 'Usuario no encontrado' };

            const validPassword: boolean = await bcrypt.compare(password, user.password);
            if (!validPassword)
                return { error: 'Contraseña incorrecta' };
            const token = jwt.sign({ id: user.id }, process.env['JWT_SECRET'] as string, {
                expiresIn: '1h',
            });
            return { token, user };
        } catch (err) {
            return { error: 'Error de servidor' };
        }
    }
}

const service = new userService();

export default service;
