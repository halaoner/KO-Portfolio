const express = require('express')
const ejsMate = require('ejs-mate')
const path = require('path')
const cookieParser = require('cookie-parser');
const jsonwebtoken = require('jsonwebtoken');

//------- Configuration -------//
require('dotenv').config()
const PORT = process.env.PORT
const JWT_SECRET = process.env.JWT_SECRET

const app = express()
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//--- parsing req.body
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser());

//---- configuration of JWT
const jwtSecret = JWT_SECRET


//-------------ROUTES-------------//
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/home', (req, res) => {
    res.send('Home Page')
})

app.get('/projects', (req, res) => {
    res.send('Projects page')
})

app.get('/about', (req, res) => {
    res.send('Aboutme')
})

//------------- LOGIN -------------//
app.get('/admin', (req, res) => {
    if (req.cookies.token) {
        res.redirect('/secret')
        // console.log(req.cookies.token)
    }
    else {
        res.render('login')
    }
})

//------------------- LOGIN + JWT ISSUE -------------------//
app.post('/login', (req, res) => {
    const payload = {
        user: req.body.username,
        role: 'admin'
        // role: 'notAdmin'
    }
    try {
        if (req.body.username === 'Tim' && req.body.password === 'tim') {
            const token = jsonwebtoken.sign(payload, jwtSecret, { expiresIn: '1800s' }, { algorithm: 'HS256' })
            res.cookie('token', token, { httpOnly: true });
            // console.log(`Issued Token: ${token}`)
            // res.send('Tim is logged in.')
            res.redirect('/secret')
            console.log('Admin is logged in.')
        }
        else {
            console.log('You are not admin!')
            res.send('You are not admin!')
        }
    } catch (err) {
        console.log(err.message)
    }
})

//------------------- JWT VERIFICATION -------------------//
app.get('/secret', (req, res) => {
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
                    res.send('JWT IS VALID - ACCESS APPROVED.')
                }
                else {
                    res.send('You are not admin!')
                }
            }
            // console.log('Decoded JWT:', decodedJWT)
        })
    } catch (error) {
        console.log(error.message)
    }
})

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT} 🚀`)
})
