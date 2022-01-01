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
// _csrt is a secret used for CSRF token, stored in the Cookies (can be also stored in the session)
// dynamically changing csrf token is derived from the _csrf secret
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: true,
        key: '_csrf',
        maxAge: 1800
    }
})

const parseForm = bodyParser.urlencoded({ extended: false })

const app = express()
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser());
app.use(csrfProtection)


//------- HTTP PAYLOAD - JWT CONTENT -------//
const payload = {
    user: 'Tim Burton',
    role: 'admin',
    // role: 'user',
    company: 'XYZ'
}


//------- PROTECTED ROUTE - JWT VERIFICATION -------//
router.get('/admin', (req, res) => {
    try {
        res.cookie('originalURL', req.originalUrl, { httpOnly: true });
        if (req.cookies.accessToken) {
            const sentJWT = req.cookies.accessToken
            jsonwebtoken.verify(sentJWT, jwtSecret, function (error, decodedJWT) {
                if (error) {
                    console.log(`ERROR: ${error.message}`)
                    res.clearCookie('accessToken')
                    res.send('Cannot access this resource: JWT IS INVALID')
                }
                else {
                    if (decodedJWT.role === 'admin') {
                        console.log('JWT and role is valid!')
                        const username = decodedJWT.user
                        const role = decodedJWT.role
                        res.render('admin', { username, role })
                        console.log('Decoded JWT admin accesToken:', decodedJWT)
                    }
                    else {
                        res.send('You are not admin! Do not have permissions!')
                    }
                }
            })
        }
        else {
            res.redirect('/login')
        }
    }
    catch (error) {
        console.log(`Secret /admin error: ${error.message}`)
    }
})

router.get('/login', csrfProtection, (req, res) => {
    const csrfToken = req.csrfToken()
    const username = req.body.username
    const password = req.body.password
    res.render('login', { csrfToken, username, password })
})

// ------------------- JWT ISSUE-------------------//
router.post('/login', parseForm, csrfProtection, (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password
        const originalURL = req.cookies.originalURL
        if (username === 'Tim' && password === 'tim' && originalURL === '/admin') {
            const accessToken = jsonwebtoken.sign(payload, jwtSecret, { expiresIn: '120s' }, { algorithm: 'HS256' })
            res.cookie('accessToken', accessToken, { httpOnly: true });
            req.flash('success', 'Successfully logged in.',)
            // TODO: not hardcode the 'admin' page --> lookup to the original URL
            res.redirect(req.cookies.originalURL)
            console.log('Admin is logged in.')
        }
        // TODO: if role admin and enter username: Tom and password: tom, flash ivalid role
        else if (username === 'Tom' && password === 'tom' && originalURL === '/user') {
            const userAccessToken = jsonwebtoken.sign(payload, jwtSecret, { expiresIn: '120s' }, { algorithm: 'HS256' })
            res.cookie('userAccessToken', userAccessToken, { httpOnly: true });
            req.flash('success', 'Successfully logged in.',)
            // TODO: not hardcode the 'admin' page --> lookup to the original URL
            res.redirect(req.cookies.originalURL)
            console.log('User is logged in.')
        }
        else {
            console.log('You are not admin nor user!')
            req.flash('error', 'Invalid username or password. Try it again.')
            res.redirect('/login')
        }
    } catch (err) {
        console.log(`Admin Post login error: ${err.message}`)
    }

})

router.post('/logout', (req, res) => {
    if (req.cookies.accessToken) {
        res.clearCookie('accessToken', 'originalURL')
        console.log(`Deleted JWT admin accessToken: ${req.cookies.accessToken}`)
        res.redirect('/login')
    }
    else if (req.cookies.userAccessToken) {
        res.clearCookie('userAccessToken', 'originalURL')
        console.log(`Deleted JWT user accessToken: ${req.cookies.userAccessToken}`)
        res.redirect('/login')
    }
    else {
        res.send('Not Authorized!')
    }
})

module.exports = router;
