const express = require('express')
const ejsMate = require('ejs-mate')
const path = require('path')
const cookieParser = require('cookie-parser')
const jsonwebtoken = require('jsonwebtoken')
const router = express.Router()
const csrf = require('csurf')
const bodyParser = require('body-parser')

//------- .ENV CONFIGURATION -------//
require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET

//------- CSRF SECRET CONFIGURATION -------//
//----- _csrf is a secret used for CSRF token, stored in the Cookies
//----- dynamically changing csrf token is derived from the _csrf secret
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: true,
        key: '_csrf',
        maxAge: 1800
    }
})

// _csrt is a secret used for CSRF token, stored in the Cookies
// const csrfProtection = csrf({
//     cookie: false
// })

//TODO:
// should not store CSRF in the Cookie - just store on server and compare it from the client in hidden form
// store CSRF on the sever side - CSRF should me unique for every request

const parseForm = bodyParser.urlencoded({ extended: false })

const app = express()
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser());
app.use(csrfProtection)


router.get('/user', csrfProtection, (req, res) => {
    const csrfToken = req.csrfToken()
    const username = req.body.username
    const password = req.body.password
    console.log(req.session.csrfSecret)
    console.log('Server issued CSRF token:', csrfToken)
    res.render('user', { csrfToken, username, password })
})


router.post('/userLogin', parseForm, csrfProtection, (req, res) => {
    const payload = {
        user: 'Tom Timmy',
        // role: 'user',
        role: 'admin',
        company: 'XYZ'
    }
    try {
        const username = req.body.username
        const password = req.body.password
        // const csrfToken = req.csrfToken()
        if (username === 'Tom' && password === 'tom') {
            const token = jsonwebtoken.sign(payload, jwtSecret, { expiresIn: '120s' }, { algorithm: 'HS256' })
            res.cookie('token', token, { httpOnly: true });
            console.log(`Issued JWT Access Token: ${token}`)
            req.flash('success', 'Successfully logged in.',)
            res.redirect('/protectedUser')
            console.log(username, 'is logged in.')
        }
        else {
            console.log('You are not authorized user!')
            req.flash('error', 'Invalid username or password. Try it again.',)
            res.redirect('/user')

        }
    } catch (err) {
        console.log(`Post login error: ${err.message}`)
    }

})

router.get('/protectedUser', (req, res) => {
    try {
        if (req.cookies.token) {
            const sentJWT = req.cookies.token
            jsonwebtoken.verify(sentJWT, jwtSecret, function (error, decodedJWT) {
                if (error) {
                    console.log(`ERROR: ${error.message}`)
                    res.clearCookie('token')
                    res.send('CANNOT ACCESS THIS OBJECT. JWT IS INVALID')
                }
                else {
                    if (decodedJWT.role === 'user') {
                        const username = decodedJWT.user
                        const role = decodedJWT.role
                        console.log('JWT and role is valid! Role:', role)
                        // console.log('Decoded JWT:', decodedJWT)
                        res.render('protectedUser', { username, role })
                    }
                    if (decodedJWT.role === 'admin') {
                        const username = decodedJWT.user
                        const role = decodedJWT.role
                        console.log('JWT and role is valid! Role:', role)
                        res.render('admin', { username, role })
                    }
                    else {
                        res.send('Do not have permissions!')
                    }
                }
            })
        }
        else {
            console.log('No access token issued.')
            res.redirect('/user')
        }
    }
    catch (error) {
        console.log(`Secret error: ${error.message}`)
    }
})

router.get('/userLogin', csrfProtection, (req, res) => {
    const csrfToken = req.csrfToken()
    const username = req.body.username
    const password = req.body.password
    console.log('Server issued CSRF token:', csrfToken)
    res.render('user', { csrfToken, username, password })
})

router.post('/userLogout', (req, res) => {
    res.clearCookie('token')
    console.log(`Deleted JWT access token: ${req.cookies.token}`)
    res.redirect('/user')
})


//------------- FETCHING DATA FROM CLIENT -------------//
router.get('/fetch', csrfProtection, (req, res) => {
    const csrfToken = req.csrfToken()
    console.log('Fetch route hit.')
    // res.redirect('/cookie/:value')
    res.render('fetch-route', { csrfToken })
})

router.post('/cookie/:value', csrfProtection, (req, res) => {
    const csrfSecret = req.cookies._csrf
    const clientCSRFToken = req.params
    const cookie = req.cookies
    console.log('******************************************************************')
    console.log('Cookies:', cookie)
    console.log('CSRF Secret:', csrfSecret)
    console.log('Params:', req.params)
    console.log('******************************************************************')
    // res.status(200).json({ Cookies: cookie, CSRFSecret: csrfSecret, CSRFToken: csrfToken })
    res.status(200).json({ clientCSRFToken: clientCSRFToken })
})

router.get('/cookie/:value', csrfProtection, (req, res) => {
    const csrfSecret = req.cookies._csrf
    const cookie = req.cookies
    console.log('******************************************************************')
    console.log('Cookies:', cookie)
    console.log('CSRF Secret:', csrfSecret)
    // console.log('Body:', req.body)
    console.log('Params:', req.params)
    console.log('******************************************************************')
    // res.status(200).json({ Cookies: cookie, CSRFSecret: csrfSecret })
    res.status(200).json({ CSRFSecret: csrfSecret })
})




//TODO:
// /admin --> login --> AUTH is OK --> /admin ------> OK
// /webshop --> login --> AUTH is OK --> /webshop
// unprotected URL - no AUTH - render Hello Nobody -> login --> AUTH OK --> protected URL - render Hello Ondrej ---> OK
// wrong password --> render error page with login page/ button with Try Login again (chance for user to log in again) ---> OK

module.exports = router;
