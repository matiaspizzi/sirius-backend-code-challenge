import { prisma } from '../index';
import { User, UserStats } from '../types';

const saveUser = async (
    username: string,
    password: string,
    role: string
): Promise<User | undefined> => {
    try {
        const user = await prisma.user.create({
            data: {
                username,
                password,
                role,
            },
        });
        return user;
    } catch (err) {
        console.error(err);
        return;
    }
};

const getUserById = async (id: number): Promise<User | null | undefined> => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        return user;
    } catch (err) {
        console.error(err);
        return;
    }
};

const getUserByUsername = async (username: string): Promise<User | null | undefined> => {
    try {
        const user = await prisma.user.findUnique({ where: { username } });
        return user;
    } catch (err) {
        console.error(err);
        return;
    }
};

const getUsersStats = async (): Promise<UserStats[] | undefined> => {
    try {
        const users = await prisma.user.findMany({
            where: {
                quota: { gt: 0 },
                lastQuotaCheck: { equals: new Date().toLocaleDateString() },
            },
            select: {
                id: true,
                username: true,
                quota: true,
                lastQuotaCheck: true,
            },
        });
        return users;
    } catch (err) {
        console.error(err);
        return;
    }
};

const updateUserQuota = async (
    id: number,
    newQuota: number
): Promise<User | null | undefined> => {
    try {
        const user = await prisma.user.update({
            where: { id },
            data: {
                lastQuotaCheck: new Date().toLocaleDateString(),
                quota: newQuota,
            },
        });
        return user;
    } catch (err) {
        console.error(err);
        return;
    }
};

export { saveUser, getUserById, getUserByUsername, getUsersStats, updateUserQuota };
