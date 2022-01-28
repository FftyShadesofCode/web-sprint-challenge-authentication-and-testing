const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

let masterHash

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})
afterAll(async () => {
    await db.destroy() // disconnects from db
})

// Write your tests here

describe('sanity tests', () => {
    test('tests are working', () => {
        expect(true).toBe(true)
    })

    it('is the correct env', () => {
        expect(process.env.NODE_ENV).toBe('testing')
    })
})

describe('test [POST] /api/auth/register', () => {

    const newUser = {
        username: "Iamauser",
        password: "123456"
    }

    let res
    beforeAll(async () => {
        res = await request(server).post('/api/auth/register').send(newUser)
        masterHash = res.body.password
    })

    it('res status 201 on success', async () => {
        expect(res.status).toBe(201)
    })
    it('returns user with hashed password on success', async () => {
        expect(res.body.username).toBe(newUser.username)
        expect(res.body.password).not.toBe(newUser.password)
        expect(res.body.password).toBe(masterHash)
    })

})

describe('text [POST] /api/auth/login', () => {

    const loginUser = {
        username: "Iamauser",
        password: "123456"
    }

    let res
    beforeAll(async () => {
        res = await request(server).post('/api/auth/login').send(loginUser)
    })

    it('res status 200 on success', async () => {
        expect(res.status).toBe(200)
    })
    it('returns response on success', async () => {
        expect(res.body.message).toContain(`welcome, ${loginUser.username}`)
    })
})

describe('test [GET] /api/jokes/', () => {

    it('rejects access if no token', async () => {
        let res = await request(server).get('/api/jokes')
        expect(res.body.message).toBe("token required")
    })

    it('returns jokes if token', async () => {

        const loginUser = {
            username: "Iamauser",
            password: "123456"
        }

        let thing = await request(server).post('/api/auth/login').send(loginUser)

        let token = thing.body.token

        let res = await request(server).get('/api/jokes').set('Authorization', token)

        expect(res.body).toHaveLength(3)
    })
})