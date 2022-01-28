const db = require("../../data/dbConfig");

module.exports = {
    find,
    add,
    findById,
    getAll
};

function getAll() {
    return db("users");
}

function find(username) {
    return db("users").where({username: username});
}

function findById(id) {
    return db("users").where("id", id).first();
}

async function add(user) {
    const [id] = await db("users").insert(user);
    return findById(id);
}