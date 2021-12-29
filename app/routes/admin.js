const express = require('express')
const ejsMate = require('ejs-mate')
const path = require('path')
const cookieParser = require('cookie-parser')
const jsonwebtoken = require('jsonwebtoken')
const router = express.Router()
const csrf = require('csurf')
const bodyParser = require('body-parser')
const fs = require('fs')

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
                        // console.log('Redirecting to original URL:', req.originalUrl)
                        // res.render(req.originalUrl, { username, role })
                    }
                    else {
                        res.send('You are not admin! Do not have permissions!')
                    }
                }
            })
        }
        else {
            // res.redirect('/login')
            req.session.originalURL = req.originalUrl
            // console.log('Original URL:', req.originalUrl)
            // console.log('Original URL - session:', req.session.originalURL)
            res.cookie('originalURL', req.originalUrl, { httpOnly: true });
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
    // console.log('Server issued CSRF token:', csrfToken)
    // req.originalUrl = '/admin'
    // console.log('Original URL - GET Login Cookie:', req.cookies.originalURL)
    // console.log('Original URL - GET Login session:', req.session)
    res.render('login', { csrfToken, username, password })
})

// ------------------- JWT ISSUE-------------------//
router.post('/login', parseForm, csrfProtection, (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password
        const csrfToken = req.csrfToken()
        if (username === 'Tim' && password === 'tim') {
            const accessToken = jsonwebtoken.sign(payload, jwtSecret, { expiresIn: '120s' }, { algorithm: 'HS256' })
            res.cookie('accessToken', accessToken, { httpOnly: true });
            // console.log(`Issued JWT Access Token: ${token}`)
            req.flash('success', 'Successfully logged in.',)
            // not hardcode the 'admin' page --> lookup to the original URL
            res.redirect(req.cookies.originalURL)
            // console.log('Original URL - POST Login:', req.originalUrl)
            console.log('Admin is logged in.')
        }
        if (username === 'Tom' && password === 'tom') {
            const username = req.body.username
            const password = req.body.password
            const accessToken = jsonwebtoken.sign(payload, jwtSecret, { expiresIn: '120s' }, { algorithm: 'HS256' })
            res.cookie('accessToken', accessToken, { httpOnly: true });
            // console.log(`Issued JWT Access Token: ${token}`)
            req.flash('success', 'Successfully logged in.',)
            // not hardcode the 'admin' page --> lookup to the original URL
            res.redirect(req.cookies.originalURL)
            // res.render('user', { username, password, csrfToken })
            // console.log('Original URL:', req)
            console.log('Original URL:', req.originalUrl)
            console.log('User is logged in.')
        }
        else {
            console.log('You are not admin!')
            console.log('Original URL - admin:', req.originalUrl)
            req.flash('error', 'Invalid username or password. Try it again.',)
            res.redirect('/login')

        }
    } catch (err) {
        console.log(`Admin Post login error: ${err.message}`)
    }

})

router.post('/logout', (req, res) => {
    if (req.cookies.accessToken) {
        res.clearCookie('accessToken', 'originalURL')
        console.log(`Deleted JWT access accessToken: ${req.cookies.accessToken}`)
        res.redirect('/login')
    }
    else {
        res.send('Not Authorized!')
    }
})

//TODO:
// /admin --> login --> AUTH is OK --> /admin ------> OK
// /webshop --> login --> AUTH is OK --> /webshop ----> OK
// unprotected URL - no AUTH - render Hello Nobody -> login --> AUTH OK --> protected URL - render Hello Ondrej ---> OK
// wrong password --> render error page with login page/ button with Try Login again (chance for user to log in again) ---> OK


// passport.use('local', new LocalStrategy(

//     function (username, password, done) {
//         User({ username }, function (err, user) {
//             if (err) { return done(err); }
//             if (!user) { return done(null, false); }
//             if (!user.verifyPassword(password)) { return done(null, false); }
//             return done(null, user);
//         });
//     }
// ));

// passport.use(new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'passwd',
//     passReqToCallback: true,
//     session: false
// },
//     function (req, username, password, done) {
//         // request object is now first argument
//         // ...
//     }
// ));

// router.get('/login', csrfProtection, (req, res) => {
//     const csrfToken = req.csrfToken()
//     const username = req.body.username
//     const password = req.body.password
//     console.log('Server issued CSRF token ---->', csrfToken)
//     res.render('login', { csrfToken, username, password })
// })


// router.post('/login',
//     passport.authenticate('local', { failureRedirect: '/login' }),
//     function (req, res) {
//         res.redirect('/admin');
//     });


module.exports = router;
