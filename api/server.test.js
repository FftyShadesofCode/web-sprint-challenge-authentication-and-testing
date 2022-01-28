// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')
const {createToken} = require('./auth/auth-model')

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

describe('server.js', () => {
    describe('[POST] /api/auth/register', () => {
        it(`[1] responds with correct message on valid register of user`, async () => {

            const res = await request(server).post('/api/auth/register')
                .send({username: 'waylay', password: '70K/Y'})
            expect(res.body.message.username).toMatch(/waylay/i)

        })
        it(`[2] will reject with correct message, a user register with no name`, async () => {

            const res = await request(server).post('/api/auth/register')
                .send({username: '', password: '70K/Y'})
            expect(res.body.message).toMatch(/username and password required/i)

        })
        it(`[3] will reject with correct message, a user register with no password`, async () => {

            const res = await request(server).post('/api/auth/register')
                .send({username: 'waylay', password: ''})
            expect(res.body.message).toMatch(/username and password required/i)

        })
        it(`[4] will reject with correct message, a username that already exists`, async () => {

            await request(server).post('/api/auth/register')
                .send({username: 'waylay', password: '123'})
            const res = await request(server).post('/api/auth/register')

                .send({username: 'waylay', password: '12345'})
            expect(res.body.message).toMatch(/username taken/i)

        })
        it(`[5] can succesfully ad user to DB`, async () => {

            const checkBase = await db('users').where('username', 'waylay').first()
            expect(checkBase).toMatchObject({username: 'waylay'})

        })
    })
    describe('[POST] /api/auth/login', () => {
        it(`[1] will reject login with correct message if username does not exist`, async () => {

            const res = await request(server).post('/api/auth/login')
                .send({username: 'bobby', password: '1234'})

            expect(res.body.message).toMatch(/invalid credentials/i)
        })
        it(`[2] will reject login with correct message if username is left blank`, async () => {

            const res = await request(server).post('/api/auth/login')
                .send({username: '', password: '1234'})

            expect(res.body.message).toMatch(/username and password required/i)
        })
        it(`[3] will reject login with correct message if password is left blank`, async () => {

            const res = await request(server).post('/api/auth/login')
                .send({username: 'waylay', password: ''})

            expect(res.body.message).toMatch(/username and password required/i)
        })
        it(`[4] will reject login with correct message if user exists and password is wrong`, async () => {

            await request(server).post('/api/auth/register')
                .send({username: 'waylay', password: '12345'})


            const res = await request(server).post('/api/auth/login')
                .send({username: 'waylay', password: '1234'})

            expect(res.body.message).toMatch(/invalid credentials/i)
        })
    })
    describe('[GET] /api/jokes', () => {
        it(`[1] will NOT GET data from api without auth, and responds with correct message`, async () => {

            const res = await request(server).get('/api/jokes')
            expect(res.body.message).toMatch(/token required/i)
        })
        it(`[2] will GET data from api with auth`, async () => {

            let token
            await request(server).post('/api/auth/register')
                .send({username: 'chip', password: '12345'})
            await request(server).post('/api/auth/login')
                .send({username: 'chip', password: '12345'})
                .then((res) => token = res.body.token)


            const res = await request(server).get('/api/jokes').set('authorization', 'Bearer ' + token)
            expect(res.status).toBe(200)
        })
    })
})