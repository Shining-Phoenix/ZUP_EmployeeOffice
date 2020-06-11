const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const keys = require('../config/keys')
const db = require('../shared/pgdb')
const errorHandler = require('../utils/errorHandler')

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.jwt
}

findUserById = async (value) => {
    const client = await db.client()

    try {
        await client.query('BEGIN')
        const sql = `SELECT pk, email, user_password, base_pk  FROM users WHERE pk = $1`;
        const {rows} = await client.query(sql, [value]);
        const user = rows[0]

        const sqlGroup = `SELECT group_pk FROM users_groups WHERE user_pk = $1`
        const {rows: userGroup} = await client.query(sqlGroup, [value])
        const roles = []

        for (group of userGroup){
            if (group.group_pk === 2) {roles.push("SuperAdmin")}
            else if (group.group_pk === 1) {roles.push("Admin")}
            else if (group.group_pk === 0) {roles.push("User")}
            else roles.push("Undefined")}
        user.roles = roles

        await client.query('COMMIT')
        client.release()

        return user
    } catch (e) {
        errorHandler(value, e)
        await client.query('ROOLBACK')
        client.release()
        throw e
    }
}

module.exports = passport => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const user = await findUserById(payload.userId)

        if (user) {
          done(null, user)
        } else {
          done(null, false)
        }
      } catch (e) {
        console.log(e)
      }

    })
  )
}