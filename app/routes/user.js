const express = require('express')
const ejsMate = require('ejs-mate')
const path = require('path')
const cookieParser = require('cookie-parser')
const jsonwebtoken = require('jsonwebtoken')
const router = express.Router()

//------- .ENV CONFIGURATION -------//
require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET

const app = express()
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser());

//------- PROTECTED ROUTE - JWT VERIFICATION -------//
router.get('/user', (req, res) => {
    try {
        res.cookie('originalURL', req.originalUrl, { httpOnly: true });
        if (req.cookies.userAccessToken) {
            const sentJWT = req.cookies.userAccessToken
            jsonwebtoken.verify(sentJWT, jwtSecret, function (error, decodedJWT) {
                if (error) {
                    console.log(`ERROR: ${error.message}`)
                    res.clearCookie('userAccessToken')
                    res.send('Cannot access this resource: JWT IS INVALID')
                }
                else {
                    if (decodedJWT.role === 'user') {
                        console.log('JWT and role is valid!')
                        const username = decodedJWT.user
                        const role = decodedJWT.role
                        console.log('Decoded user JWT accessToken:', decodedJWT)
                        res.render('user', { username, role })
                    }
                    else {
                        res.send('You are not user! Do not have permissions - invalid role!')
                        // req.flash('error', 'Invalid username, password or role. Try it again.')
                    }
                }
            })
        }
        else {
            res.redirect('/login')
        }
    }
    catch (error) {
        console.log(`Secret /user error: ${error.message}`)
    }
})

module.exports = router;
