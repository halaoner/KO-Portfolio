const express = require('express')
const ejsMate = require('ejs-mate')
const path = require('path')
const cookieParser = require('cookie-parser');
const jsonwebtoken = require('jsonwebtoken');
const router = express.Router()

//------- Configuration -------//
require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET

const app = express()
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//--- parsing req.body
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser());


router.get('/admin', (req, res) => {
    if (req.cookies.token) {
        res.redirect('/secret')
    }
    else {
        res.redirect('/login')
    }
})

router.get('/login', (req, res) => {
    res.render('login')
})


// ------------------- JWT ISSUE-------------------//
router.post('/login', (req, res) => {
    const payload = {
        user: 'Tim Burton',
        role: 'admin',
        // role: 'notAdmin',
        company: 'XYZ'
    }
    try {
        if (req.body.username === 'Tim' && req.body.password === 'tim') {
            const token = jsonwebtoken.sign(payload, jwtSecret, { expiresIn: '1800s' }, { algorithm: 'HS256' })
            res.cookie('token', token, { httpOnly: true });
            console.log(`Issued Token: ${token}`)
            res.redirect('/secret')
            console.log('Admin is logged in.')
        }
        else {
            console.log('You are not admin!')
            res.send('You are not admin!')
        }
    } catch (err) {
        console.log('Post error:', err.message)
    }

})

// ------------------- JWT VERIFICATION-------------------//
router.get('/secret', (req, res) => {
    try {
        const sentJWT = req.cookies.token
        const decodedJWT = jsonwebtoken.verify(sentJWT, jwtSecret, function (error, decodedJWT) {
            if (error) {
                console.log(`ERROR: ${error.message}`)
                res.send('CANNOT ACCESS THIS OBJECT. JWT IS INVALID')
            }
            else {
                if (decodedJWT.role === 'admin') {
                    console.log('JWT AND ROLE IS VALID')
                    // res.send('JWT IS VALID - ACCESS APPROVED.')
                    const username = decodedJWT.user
                    const role = decodedJWT.role
                    res.render('admin', { username, role })
                }
                else {
                    res.send('You are not admin! Do not have permissions!')
                }
            }
            console.log('Decoded JWT:', decodedJWT)
        })
    } catch (error) {
        console.log('Secret error:', error.message)
    }
})

router.post('/logout', (req, res) => {
    if (req.cookies.token) {
        res.clearCookie('token')
        console.log('Deleted JWT access token:', req.cookies)
        res.redirect('/login')
    }
    else {
        res.send('Not Authorized!')
    }
})

module.exports = router;
