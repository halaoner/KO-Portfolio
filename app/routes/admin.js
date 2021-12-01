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
// _csrt is a secret used for CSRF token, stored in the Cookies
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

//------- PROTECTED ROUTE - VERIFY JWT -------//
router.get('/admin', (req, res) => {
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
                    if (decodedJWT.role === 'admin') {
                        console.log('JWT and role is valid!')
                        const username = decodedJWT.user
                        const role = decodedJWT.role
                        res.render('admin', { username, role })
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
        console.log(`Secret error: ${error.message}`)
    }
})

router.get('/login', csrfProtection, (req, res) => {
    const csrfToken = req.csrfToken()
    const username = req.body.username
    const password = req.body.password
    console.log('Server issued CSRF token:', csrfToken)
    res.render('login', { csrfToken, username, password })
})

// router.get('/test', csrfProtection, (req, res) => {
//     const csrfToken = req.csrfToken()
//     const username = req.body.username
//     const password = req.body.password
//     console.log(username)
//     // const password = req.body.password
//     // res.clearCookie('_csrf')
//     // console.log('Server CSRF token:', csrfToken)
//     // res.cookie('csrf-token', csrfToken)
//     res.render('testLogin', { csrfToken, username, password })
//     // res.send({ csrfToken })
//     // console.log(req.body)
// })

// router.post('/test', parseForm, csrfProtection, (req, res) => {
//     const username = req.body.username
//     const password = req.body.password
//     if (username === "Tom" && password === "tom") {
//         console.log('Logged in')
//         req.flash('success', 'Successfully Logged in!')
//         // res.redirect('/testFlash')
//         res.render('testFlash', { username, password })
//     }
//     else {
//         req.flash('error', 'Invalid username or password')
//         res.redirect('/test')

//     }

// })

// router.get('/testFlash', (req, res) => {
//     // const csrfToken = req.csrfToken()
//     const username = req.body.username
//     const password = req.body.password
//     // console.log('body:', req.flash())
//     // req.flash('success', 'Successfully Logged in!')
//     res.render('testFlash', { username, password })
// })

// router.get('/testLogin', (req, res) => {
//     const username = req.body.username
//     const password = req.body.password
//     res.render('testLogin')
// })



//------- Fetching data from the client --------//
// router.post('/test/:csrfToken', parseForm, csrfProtection, (req, res) => {
//     if (req.body.username === "Tom" && req.body.password === "tom") {
//         // const csrfToken = req.csrfToken()
//         const clientCSRFToken = req.params.csrfToken
//         // console.log('Server issued CSRF token:', csrfToken)
//         // console.log('Client CSRF token:', clientCSRFToken)
//         if (clientCSRFToken) {
//             // console.log('Server CSRF token:', csrfToken)
//             console.log('Client CSRF token:', clientCSRFToken)
//             res.send('ALL GOOD')
//         }
//         else {
//             console.log('CSRF tokens do not match!')
//         }

//     }
//     else {
//         res.send('NOT TOM')
//     }
// })


// ------------------- JWT ISSUE-------------------//
router.post('/login', parseForm, csrfProtection, (req, res) => {
    const payload = {
        user: 'Tim Burton',
        role: 'admin',
        // role: 'notAdmin',
        company: 'XYZ'
    }
    try {
        const username = req.body.username
        const password = req.body.password
        // const csrfToken = req.csrfToken()
        if (username === 'Tim' && password === 'tim') {
            const token = jsonwebtoken.sign(payload, jwtSecret, { expiresIn: '120s' }, { algorithm: 'HS256' })
            res.cookie('token', token, { httpOnly: true });
            console.log(`Issued JWT Access Token: ${token}`)
            req.flash('success', 'Successfully logged in.',)
            res.redirect('admin')
            console.log('Admin is logged in.')
        }
        else {
            console.log('You are not admin!')
            req.flash('error', 'Invalid username or password. Try it again.',)
            res.redirect('/login')

        }
    } catch (err) {
        console.log(`Post login error: ${err.message}`)
    }

})

router.post('/logout', (req, res) => {
    if (req.cookies.token) {
        res.clearCookie('token')
        console.log(`Deleted JWT access token: ${req.cookies.token}`)
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

module.exports = router;
