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

interface UserStats {
    id: number;
    username: string;
    quota: number;
    lastQuotaCheck: string | null;
}

interface Mail {
    id: number;
    authorId: number;
    to: string;
    subject: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
}



export { User, UserStats, Mail }