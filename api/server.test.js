const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})
beforeEach(async () => {
    await db.seed.run()
})
afterAll(async () => {
    await db.destroy()
})

describe("Database environment", () => {
    it("is in the testing environment", () => {
        expect(process.env.NODE_ENV).toBe('testing')
    })
})

describe("[POST] /api/auth/register", () => {
    let res
    beforeEach(async () => {
        res = await request(server)
            .post('/api/auth/register')
            .send({
                username: "Alfred9000",
                password: "abc123"
            })
    })
    it("responds with new user and status code 201 if inputs are valid", async () => {
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty("id", 2)
        expect(res.body).toHaveProperty("username", "Alfred9000")
        expect(res.body).toHaveProperty("password")
    })
    it('responds with { message: "username and password required" } and status code 400 if the request body does not contain either a username or password key with a value', async () => {
        const response = await request(server)
            .post('/api/auth/register')
            .send({
                username: "",
                password: "1234"
            })
        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({
            message: "username and password required"
        })
    })
    it('responds with { message: "username taken" } and status code 409 if the username in the request body already exists in the database', async () => {
        const response = await request(server)
            .post("/api/auth/register")
            .send({
                username: "eli_the_lion",
                password: "1234"
            })
        expect(response.status).toBe(409)
        expect(response.body).toMatchObject({
            message: "username taken"
        })
    })
})

describe("[POST] /api/auth/login", () => {
    it('responds with an object containing a "message" key with the value "welcome {nameOfUser}" and status code 200 if the request body username and password are valid', async () => {
        const response = await request(server)
            .post("/api/auth/login")
            .send({
                username: "eli_the_lion",
                password: "abc123"
            })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("message", "welcome eli_the_lion")
    })
    it('responds with { message: "invalid credentials" } and status code 401 if request body username and password are invalid', async () => {
        const response = await request(server)
            .post("/api/auth/login")
            .send({
                username: "eli_the_lion",
                password: "badPassword"
            })
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("message", "invalid credentials")
    })
    it('responds with { message: "username and password required" } and status code 400 if either request body username or password are missing', async () => {
        const response = await request(server)
            .post("/api/auth/login")
            .send({
                username: "",
                password: "abc123"
            })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "username and password required")
    })
})

describe("[GET] /api/jokes", () => {
    it("responds with an array of jokes and a status code of 200 if request headers authorization is valid", async () => {
        const loginRes = await request(server)
            .post("/api/auth/login")
            .send({
                username: "eli_the_lion",
                password: "abc123"
            })
        const response = await request(server)
            .get("/api/jokes")
            .set("Authorization", loginRes.body.token)
        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(3)
    })
    it('responds with { message: "token required" } and status code 401 if the request is unauthorized', async () => {
        const response = await request(server)
            .get("/api/jokes")
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("message", "token required")
    })
    it('responds with { message: "token invalid" } and status code 401 if the authorization header has a bad token', async () => {
        const response = await request(server)
            .get("/api/jokes")
            .set("Authorization", "superBadToken")
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("message", "token invalid")
    })
})