const express = require('express')
const ejsMate = require('ejs-mate')
const path = require('path')
const cookieParser = require('cookie-parser');
const jsonwebtoken = require('jsonwebtoken');
const router = express.Router()
const csrf = require('csurf')
const bodyParser = require('body-parser')

//------- .ENV CONFIGURATION -------//
require('dotenv').config()
const jwtSecret = process.env.JWT_SECRET

//------- CSRF TOKEN CONFIGURATION -------//
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


//------- PROTECTED ROUTE - VERIFY JWT -------//
router.get('/admin', (req, res) => {
    try {
        if (req.cookies.token) {
            const sentJWT = req.cookies.token
            const decodedJWT = jsonwebtoken.verify(sentJWT, jwtSecret, function (error, decodedJWT) {
                if (error) {
                    console.log(`ERROR: ${error.message}`)
                    res.send('CANNOT ACCESS THIS OBJECT. JWT IS INVALID')
                }
                else {
                    if (decodedJWT.role === 'admin') {
                        console.log('JWT AND ROLE IS VALID')
                        // console.log('Decoded JWT:', decodedJWT)
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
    res.render('login', { csrfToken })
})

// ------------------- JWT ISSUE-------------------//
router.post('/login', parseForm, csrfProtection, (req, res) => {
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
            console.log(`Issued JWT Access Token: ${token}`)
            res.redirect('admin')
            console.log('Admin is logged in.')
        }
        else {
            console.log('You are not admin!')
            res.send('You are not admin!')
        }
    } catch (err) {
        console.log(`Post error: ${err.message}`)
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

router.get('/csrf', csrfProtection, (req, res) => {
    res.send(`
    <h1>Hello World</h1>
    <form id="hackedForm" action="/malicious-link" method="POST">
      <div>
        <label for="message">Enter a message</label>
        <input id="message" name="message" type="text" />
      </div>
      <input type="submit" value="Submit" />
      <script>
      // automatic submitting form on user's behalf
    //   document.addEventListener("DOMContentLoaded", function(event) {
    //     document.getElementById('hackedForm').submit();
    //   });
      console.log("List of your cookies:",document.cookie)
      fetch ("http://localhost:3000/malicious-link", {
        method: 'POST'
      })
      .then(req=>{
          stolenCookie=document.cookie
        //   console.log("Stolen Cookie:",stolenCookie)
      })
      </script>
      </form>`);
    console.log('csrf protection', csrfProtection)
})
router.post('/malicious-link', (req, res) => {
    console.log(`Message received: ${req.body.message}`);
    res.send(`Message received: ${req.body.message}`);

    let cookie = req.cookies
    let parsedCookie = JSON.stringify(cookie)
    console.log(`Stolen Cookies: ${parsedCookie}`);
})

router.get('/csrf-protected', csrfProtection, (req, res) => {
    // res.render('csrf-login', { csrfToken: req.csrfToken() })
    // console.log(`CSRF LOGIN TOKEN: ${req.cookies._csrf}`)
    const csrfToken = req.csrfToken()
    res.render('csrf-login', { csrfToken })
})

router.post('/process', parseForm, csrfProtection, (req, res) => {
    try {
        console.log(`CSRF client token: ${req.cookies._csrf}`)
        res.send('data is being processed')
    }
    catch (error) {
        console.log(`ERROR:${error.message}`)
    }
})

module.exports = router;
