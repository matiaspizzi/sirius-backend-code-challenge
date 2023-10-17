import dotenv from 'dotenv';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { adminAuth, userAuth } from './middlewares/auth.middlewares';
import userRouter from './controllers/user.controllers';
import mailRouter from './controllers/mail.controllers';
import adminRouter from './controllers/admin.controllers';

dotenv.config();
const app = express();
let db_url = process.env['DATABASE_URL'] as string;
if (process.env['NODE_ENV'] === 'test') db_url = process.env['DATABASE_URL_TEST'] as string;
const prisma = new PrismaClient({ datasources: { db: { url: db_url } } });

app.use(express.json());
app.use('/', userRouter);
app.use('/', userAuth, mailRouter);
app.use('/', adminAuth, adminRouter);

const PORT = process.env['PORT'] || 3000;
const server = app
    .listen(PORT, () => {
        console.log(`Server is running on  http://localhost:${PORT}`);
    })
    .on('error', (err) => {
        console.error(err);
    });

export { app, server, prisma };
