import { prisma } from '../index';
import { updateUserQuota } from './user.controller';

interface User {
    id: number;
    role: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    quota: number;
    lastQuotaCheck: string | null;
}

const newMail = async (user: User, to: string, subject: string, body: string) => {
    try {
        const mail = await prisma.mail.create({
            data: {
                to,
                subject,
                body,
                author: { connect: { id: user.id } },
            },
        });
        try{
            await updateUserQuota(user.id, user.quota + 1);
            return mail;
        } catch(err){
            console.error(err)
            return
        }
    } catch (err) {
        console.error(err)
        return;
    }
}


export { newMail };