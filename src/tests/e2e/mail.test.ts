import supertest from 'supertest';
import { app, server, prisma } from '../../index';

const api = supertest(app);

beforeAll(async () => {
    await prisma.mail.deleteMany();
    await prisma.user.deleteMany();
});

test('Register: return 201', async () => {
    const res = await api.post('/register').send({
        username: 'test',
        password: 'test',
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
});

let auth_token: string;
let user_id: number;

test('Login: return 200', async () => {
    const res = await api.post('/login').send({
        username: 'test',
        password: 'test',
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.id).toBeDefined();
    user_id = res.body.user.id;
    auth_token = res.body.token;
});

test('Send (missing token): return 401', async () => {
    const res = await api
        .post('/send')
        // .set("auth_token", auth_token)
        .send({
            to: 'matias.nahuel.pizzi2@gmail.com',
            subject: 'test1',
            body: 'test1 body',
        });
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
});

test('Send (missing data): return 400', async () => {
    const res = await api.post('/send').set('auth_token', auth_token).send({
        to: 'matias.nahuel.pizzi2@gmail.com',
        // subject: "test1",
        body: 'test1 body',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
});

test('Send: return 201', async () => {
    const res = await api.post('/send').set('auth_token', auth_token).send({
        to: 'matias.nahuel.pizzi2@gmail.com',
        subject: 'test1',
        body: 'test1 body',
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.to).toBe('matias.nahuel.pizzi2@gmail.com');
    expect(res.body.subject).toBe('test1');
    expect(res.body.body).toBe('test1 body');
    expect(res.body.authorId).toBe(user_id);
});

afterAll(async () => {
    await prisma.mail.deleteMany();
    await prisma.user.deleteMany();
    await server.close();
});
