const pgConfig = require('../config/keys').pg
const { Pool } = require('pg')

const pool = new Pool(pgConfig)

module.exports = {
    query: (text, params) => pool.query(text, params),
}

