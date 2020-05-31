const express = require('express')
const passport = require('passport')
const authRoutes = require('./routes/auth')
const pictureRoutes = require('./routes/picture')
const userRoutes = require('./routes/user')
const employeesRouter = require('./routes/employee')
const commonRouter = require('./routes/common')
const inquiryRequestRouter = require('./routes/inquiryRequest')
const exchangeRouter = require('./routes/exchange')
const bodyParser = require('body-parser')

const app = express()

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(require('cors')())

app.use('/api/auth', authRoutes)
app.use('/api/picture', pictureRoutes)
app.use('/api/user', userRoutes)
app.use('/api/employee', employeesRouter)
app.use('/api/common', commonRouter)
app.use('/api/inquiry-request', inquiryRequestRouter)
app.use('/api/exchange', exchangeRouter)

module.exports = app