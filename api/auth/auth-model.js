const db = require('../../data/dbConfig')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../auth/auth-secrets')

function createToken(user) {

    const payload = {
        id: user.id,
        username: user.username,
        password: user.password,

    }
    const options = {
        expiresIn: '1d'
    }
    const result = jwt.sign(payload, JWT_SECRET, options)
    return result
}

function find() {
    return db('users').select('id', 'username')
}

function findBy(filter) {
    return db('users').where(filter)
}

function findById(id) {
    return db('users')
        .where({id})
        .first()
}

async function add(user) {
    const [id] = await db('users').insert(user)
    return findById(id)
}


module.exports = {
    add,
    find,
    findBy,
    findById,
    createToken
}