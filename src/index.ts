import dotenv from 'dotenv';
import express from 'express';
import { adminAuth, userAuth } from './middlewares/auth.middlewares';
import userRoute from './routes/user.routes';
import mailRoutes from './routes/mail.routes';
import adminRoute from './routes/admin.routes';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const app = express();
let db_url = process.env['DATABASE_URL'] as string;
if (process.env['NODE_ENV'] === 'test') db_url = process.env['DATABASE_URL_TEST'] as string;
const prisma = new PrismaClient({ datasources: { db: { url: db_url } } });

app.use(express.json());
app.use('/', userRoute);
app.use('/', userAuth, mailRoutes);
app.use('/', adminAuth, adminRoute);

const PORT = process.env['PORT'] || 3000;
const server = app
    .listen(PORT, () => {
        console.log(`Server is running on  http://localhost:${PORT}`);
    })
    .on('error', (err) => {
        console.error(err);
    });

export { app, server, prisma };
