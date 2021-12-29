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




// router.get('/user', csrfProtection, (req, res) => {
//     const csrfToken = req.csrfToken()
//     const username = req.body.username
//     const password = req.body.password
//     console.log(req.session.csrfSecret)
//     console.log('Server issued CSRF token:', csrfToken)
//     res.render('user', { csrfToken, username, password })
// })


// router.get('/user', (req, res) => {
//     try {
//         if (req.cookies.token) {
//             const sentJWT = req.cookies.token
//             jsonwebtoken.verify(sentJWT, jwtSecret, function (error, decodedJWT) {
//                 if (error) {
//                     console.log(`ERROR: ${error.message}`)
//                     res.clearCookie('token')
//                     res.send('Cannot access this resource: JWT IS INVALID')
//                 }
//                 else {
//                     if (decodedJWT.role === 'user') {
//                         console.log('JWT and role is valid!')
//                         const username = decodedJWT.user
//                         const role = decodedJWT.role
//                         res.render('user', { username, role })
//                         // console.log('Redirecting to original URL:', req.originalUrl)
//                         // res.render(req.originalUrl, { username, role })
//                     }
//                     else {
//                         res.send('You are not user! Do not have permissions!')
//                     }
//                 }
//             })
//         }
//         else {
//             res.redirect('/login')
//             console.log('Original URL:', req.originalUrl)
//         }
//     }
//     catch (error) {
//         console.log(`Secret error: ${error.message}`)
//     }
// })


//------- PROTECTED ROUTE - JWT VERIFICATION -------//
router.get('/admin', (req, res) => {
    try {
        if (req.cookies.token) {
            const sentJWT = req.cookies.token
            jsonwebtoken.verify(sentJWT, jwtSecret, function (error, decodedJWT) {
                if (error) {
                    console.log(`ERROR: ${error.message}`)
                    res.clearCookie('token')
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
            res.redirect('/login')
            console.log('Original URL:', req.originalUrl)
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
    // console.log('Server issued CSRF token:', csrfToken)
    res.render('login', { csrfToken, username, password })
})

// ------------------- JWT ISSUE-------------------//
router.post('/login', parseForm, csrfProtection, (req, res) => {
    const payload = {
        user: 'Tim Burton',
        // role: 'admin',
        role: 'user',
        company: 'XYZ'
    }
    try {
        const username = req.body.username
        const password = req.body.password
        const csrfToken = req.csrfToken()
        if (username === 'Tim' && password === 'tim') {
            const token = jsonwebtoken.sign(payload, jwtSecret, { expiresIn: '120s' }, { algorithm: 'HS256' })
            res.cookie('token', token, { httpOnly: true });
            // console.log(`Issued JWT Access Token: ${token}`)
            req.flash('success', 'Successfully logged in.',)
            // not hardcode the 'admin' page --> lookup to the original URL
            // res.redirect('back /user')
            res.redirect('/admin')
            // console.log('Original URL:', req)
            console.log('Original URL:', req.originalUrl)
            console.log('Admin is logged in.')
        }
        if (username === 'Tom' && password === 'tom') {
            const username = req.body.username
            const password = req.body.password
            const token = jsonwebtoken.sign(payload, jwtSecret, { expiresIn: '120s' }, { algorithm: 'HS256' })
            res.cookie('token', token, { httpOnly: true });
            // console.log(`Issued JWT Access Token: ${token}`)
            req.flash('success', 'Successfully logged in.',)
            // not hardcode the 'admin' page --> lookup to the original URL
            // res.redirect('back /user')
            res.redirect('/user')
            // res.render('user', { username, password, csrfToken })
            // console.log('Original URL:', req)
            console.log('Original URL:', req.originalUrl)
            console.log('User is logged in.')
        }
        else {
            console.log('You are not admin!')
            console.log('Original URL:', req.originalUrl)
            req.flash('error', 'Invalid username or password. Try it again.',)
            res.redirect('/login')

        }
    } catch (err) {
        console.log(`Admin Post login error: ${err.message}`)
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
