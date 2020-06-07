//Dependencies
const express = require('express')
const mustacheExpress = require('mustache-express')
const dotenv = require('dotenv')
const session = require('express-session')
const bodyParser = require('body-parser')

//Middleware
const userAuth = require('./middleware/userAuth')

//Routes
const mainRouter = require('./routes/main')
const userRouter = require('./routes/user')
const homeRouter = require('./routes/home')
const orderRouter = require('./routes/order')
const managementRouter = require('./routes/management')

//Configure .env
dotenv.config()

//Set port
const PORT = process.env.PORT || 3000

//Setup Express and Mustache
const app = express()
app.engine('mustache', mustacheExpress('./views/partials', '.mustache'))
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(bodyParser.urlencoded({extended: false}))

//Configure Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))

//Configure Routes
app.use('/', mainRouter)
app.use('/user', userRouter)
app.use('/home', userAuth, homeRouter)
app.use('/order', userAuth, orderRouter)
app.use('/management', userAuth, managementRouter)

//Port Listener
app.listen(PORT, () => {
    console.log('--TaskFly--')
    console.log('Running on:', PORT)
})