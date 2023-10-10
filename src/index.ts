import dotenv from 'dotenv';
import express from 'express';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const app = express();
let db_url = process.env['DATABASE_URL'] as string;
if (process.env['NODE_ENV'] === 'test') db_url = process.env['DATABASE_URL_TEST'] as string;
const prisma = new PrismaClient({ datasources: { db: { url: db_url } } });

const PORT = process.env['PORT'] || 3000;
const server = app
    .listen(PORT, () => {
        console.log(`Server is running on  http://localhost:${PORT}`);
    })
    .on('error', (err) => {
        console.error(err);
    });

export { app, server, prisma };
