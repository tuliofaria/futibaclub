const express = require('express')
const app = express()
const mysql= require('mysql2/promise')
const bodyParser = require('body-parser')
const session = require('express-session')

const account = require('./account')
const admin = require('./admin')
const groups = require('./groups')

/* Database Access */
const confsDatabase = {
    host: '192.168.99.100', 
    port: '32768', 
    user: 'root',
    password: 'devpleno',
    database: 'futibaclub' 
}

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'fullstack-academy',
    saveUninitialized: true,
    resave: true
}))
app.set('view engine', 'ejs')

const init = async () =>{
    const connection = await mysql.createConnection(confsDatabase)

    app.use((req, res, next) => {
        (req.session.user)? 
            res.locals.user = req.session.user: 
            res.locals.user = false
        next()
    })

    app.use(account(connection))
    app.use('/admin', admin(connection))
    app.use('/groups', groups(connection))

    app.listen(3000, err => console.log('Futiba Club is running...'))
}

init()