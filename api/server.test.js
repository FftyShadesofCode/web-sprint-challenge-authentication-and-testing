// Write your tests here
const server = require('./server')
const request = require('supertest')
const db = require('../data/dbConfig')

test('sanity', () => {
    expect(true).toBe(true)
})

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})

afterAll(async () => {
    await db.destroy()
})

test('correct environment', () => {
    expect(process.env.NODE_ENV).toBe('testing')
})

describe('Auth Router', () => {
    describe('POST /api/auth/register', () => {
        let res
        beforeEach(async () => {
            res = await request(server)
                .post('/api/auth/register')
                .send({username: 'Frog', password: 'Ribbit'})
        })
        test('responds with 201 created', async () => {
            expect(res.status).toBe(201)
        })
        test('new user is sent back', async () => {
            expect(res.body).toMatchObject({message: 'username taken'})
        })
    })

    describe('Post /api/auth/login', () => {
        test('logs in', async () => {
            const res = await request(server)
                .post('/api/auth/login')
                .send({username: 'Frog', password: 'Ribbit'})

            expect(res.body.message).toBe('welcome, Frog')
        })
        test('needs valid credentials', async () => {
            const res = await request(server)
                .post('/api/auth/login')
                .send()

            expect(res.body.message).toBe('username and password required')
        })
    })
})