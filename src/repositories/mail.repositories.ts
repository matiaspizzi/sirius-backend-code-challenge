import { prisma } from '../index';
import { updateUserQuota } from './user.repositories';
import { User, Mail } from '../types';

const newMail = async (
    user: User,
    to: string,
    subject: string,
    body: string
): Promise<Mail | undefined> => {
    try {
        const mail = await prisma.mail.create({
            data: {
                to,
                subject,
                body,
                author: { connect: { id: user.id } },
            },
        });
        await updateUserQuota(user.id, user.quota + 1);
        return mail;
    } catch (err) {
        console.error(err);
        return;
    }
};

export { newMail };
