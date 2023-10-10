import { adminAuth, userAuth } from './middlewares/auth.middlewares';
import userRouter from './controllers/user.controllers';
import mailRouter from './controllers/mail.controllers';
import adminRouter from './controllers/admin.controllers';
import { app } from './index';
import express from 'express';

app.use(express.json());
app.use('/', userRouter);
app.use('/', userAuth, mailRouter);
app.use('/', adminAuth, adminRouter);