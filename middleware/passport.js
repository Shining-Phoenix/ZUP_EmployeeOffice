const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const keys = require('../config/keys')
const db = require('../shared/pgdb')

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.jwt
}

findUserById = async (value) => {

    try {
        const sql = `SELECT pk, email, user_password, base_pk  FROM users WHERE pk = $1`;
        const {rows} = await db.query(sql, [value]);

        if (rows.length) {
            return rows[0]
        }

        return null
    } catch (e) {
        console.log(e)
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