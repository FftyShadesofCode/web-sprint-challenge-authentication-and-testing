const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");
const {find, add, findById} = require("./models/users-model");

const user = {username: "bo_peep", password: 1};

beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
});
beforeEach(async () => {
    await db("users").truncate();
});
afterAll(async () => {
    await db.destroy();
});

test("sanity", () => {
    expect(undefined).toBe();
});

test("correct env", () => {
    expect(process.env.NODE_ENV).toBe('testing')
});

describe("Unit testing", () => {
    test("able to add user", async () => {
        await add(user);
        expect(find(user)).toBeTruthy()
    })
    test("able find user by id", async () => {
        await add(user);
        expect(findById(1)).not.toBe()
    })
})


describe("[POST] /register", () => {
    test("successful register", async () => {
        const res = await request(server)
            .post("/api/auth/register")
            .send(user)
        expect(res.body).toBeTruthy()
    })
    test("registered user isn't undefined", async () => {
        const res = await request(server)
            .post("/api/auth/register")
            .send(user)
        expect(res.body).not.toBe()
    })
});

describe("[POST] /login", () => {
    test("successful login", async () => {
        const res = await request(server)
            .post("/api/auth/login")
            .send(user)
        expect(res.body).toBeTruthy()
    })
    test("login doesn't not work", async () => {
        const res = await request(server)
            .post("/api/auth/login")
            .send(user)
        expect(res.body).not.toBe()
    })
});