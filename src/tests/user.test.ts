import supertest from 'supertest';
import { app, prisma, server } from '../index';

const api = supertest(app);

beforeAll(async () => {
    await prisma.mail.deleteMany();
    await prisma.user.deleteMany();
});

test('Register (missing data): return 400', async () => {
    const res = await api.post('/register').send({
        username: 'test',
        // password: "test",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
});

test('Register: return 201', async () => {
    const res = await api.post('/register').send({
        username: 'test',
        password: 'test',
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
});

test('Register (user duplicated): return 400', async () => {
    const res = await api.post('/register').send({
        username: 'test',
        password: 'test',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
});

test('Login (bad password): return 401', async () => {
    const res = await api.post('/login').send({
        username: 'test',
        password: 'te',
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
});

test('Login (bad user): return 404', async () => {
    const res = await api.post('/login').send({
        username: 'te',
        password: 'test',
    });
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
});

test('Login: return 200', async () => {
    const res = await api.post('/login').send({
        username: 'test',
        password: 'test',
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
});

afterAll(async () => {
    await prisma.mail.deleteMany();
    await prisma.user.deleteMany();
    server.close();
});
