import supertest from 'supertest';
import { app, server, prisma } from '../index';

const api = supertest(app);

beforeAll(async () => {
    await prisma.mail.deleteMany();
    await prisma.user.deleteMany();
});

test('Register (admin): return 201', async () => {
    const res = await api.post('/register').send({
        username: 'admin',
        password: 'admin',
        role: 'admin',
    });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.role).toBe('admin');
});

let auth_token: string;

test('Login (admin): return 200', async () => {
    const res = await api.post('/login').send({
        username: 'admin',
        password: 'admin',
    });

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBeDefined();
    expect(res.body.user.role).toBe('admin');
    expect(res.body.token).toBeDefined();
    auth_token = res.body.token;
});

test('Stats (no users found): return 404', async () => {
    const res = await api.get('/stats').set('auth_token', auth_token);
    expect(res.status).toBe(404);
    expect(res.body.msg).toBeDefined();
});

test('Send mail: return 201', async () => {
    const res = await api.post('/send').set('auth_token', auth_token).send({
        to: 'matias.nahuel.pizzi2@gmail.com',
        subject: 'test1',
        body: 'test1 body',
    });
    expect(res.status).toBe(201);
});

test('Stats (with 1 user): return 200', async () => {
    const res = await api.get('/stats').set('auth_token', auth_token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].username).toBe('admin');
});

test('Register (not admin): return 201', async () => {
    const res = await api.post('/register').send({
        username: 'user',
        password: 'user',
    });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.role).toBe('user');
});

test('Login (not admin): return 200', async () => {
    const res = await api.post('/login').send({
        username: 'user',
        password: 'user',
    });

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBeDefined();
    expect(res.body.user.role).toBe('user');
    expect(res.body.token).toBeDefined();
    auth_token = res.body.token;
});

test('Stats (not admin): return 403', async () => {
    const res = await api.get('/stats').set('auth_token', auth_token);
    expect(res.status).toBe(403);
    expect(res.body.error).toBeDefined();
});

afterAll(async () => {
    await prisma.mail.deleteMany();
    await prisma.user.deleteMany();
    await server.close();
});
