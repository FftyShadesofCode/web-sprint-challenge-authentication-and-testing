const db = require('../../data/dbConfig')

module.exports = {
    find,
    findBy,
    findById,
    create,
}

function find() {
    return db('users')
}

function findBy(filter) {
    return db('users')
        .where(filter)
}

function findById(id) {
    return db('users')
        .where('id', id)
        .first()
}

async function create(user) {
    const [id] = await db('users').insert(user)
    return findById(id)
}