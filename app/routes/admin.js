const express = require('express')
const ejsMate = require('ejs-mate')
const path = require('path')
const cookieParser = require('cookie-parser')
const jsonwebtoken = require('jsonwebtoken')
const router = express.Router()
const csrf = require('csurf')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const AWS = require("aws-sdk")

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
    // cookie: false
})

//------- DYNAMODB CONFIGURATION -------//
AWS.config.update({
    region: "eu-west-1",
    endpoint: "http://localhost:8000"
});
// const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const docClient = new AWS.DynamoDB.DocumentClient();

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

// ------------------- LOGIN ROUTE ------------------//
router.get('/login', csrfProtection, (req, res) => {
    const csrfToken = req.csrfToken()
    const username = req.body.username
    const password = req.body.password
    // console.log('CSRF Token:', csrfToken)
    // console.log('_csrf secret:', req.cookies._csrf)
    res.render('login', { csrfToken, username, password })
})

// ------------------- LOGIN ROUTE - JWT ISSUE-------------------//
router.post('/login', parseForm, csrfProtection, (req, res) => {
    try {
        //----- Load data from the DB, which is stored -----//
        async function readData(username) {
            const params = {
                TableName: "Users",
                ProjectionExpression: "username, password",
                KeyConditionExpression: "username = :username",
                ExpressionAttributeValues: {
                    ":username": username,
                    // ":password": savedPassword
                }
            }
            try {
                const data = await docClient.query(params).promise()
                if (data.Count > 0) {
                    data.Items.forEach(function (item) {
                        // console.log("username:", item.username + "; " + "hashedPassword:", item.password)
                        savedUsername = item.username
                        savedPassword = item.password
                        console.log('Reading from DB: data found!')
                    })
                }
                else {
                    console.log('Reading from DB: Provided username or hash DO NOT MATCH with the stored one!')
                }
                //----- 'data' is the result of the readData() function -----//
                return data
            }
            catch (err) {
                console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
            }
        }
        //-------- compare 'password' provided by the user with 'savedPassword' (hash) stored in DB --------//
        const comparePwd = async (password, savedPassword) => {
            const result = await bcrypt.compare(password, savedPassword)
            const originalURL = req.cookies.originalURL

            if (result && originalURL === '/admin') {
                console.log('HASH MATCH! Successfully logged in!')
                // ------------------- JWT ISSUE-------------------//
                const accessToken = jsonwebtoken.sign(payload, jwtSecret, { expiresIn: '120s' }, { algorithm: 'HS256' })
                res.cookie('accessToken', accessToken, { httpOnly: true });
                req.flash('success', 'Successfully logged in.',)
                // TODO: not hardcode the 'admin' page --> lookup to the original URL
                res.redirect(req.cookies.originalURL)
                console.log('Admin is logged in.')
            }
            // TODO: if role admin and enter username: Tom and password: tom, flash ivalid role
            else if (result && originalURL === '/user') {
                const userAccessToken = jsonwebtoken.sign(payload, jwtSecret, { expiresIn: '120s' }, { algorithm: 'HS256' })
                res.cookie('userAccessToken', userAccessToken, { httpOnly: true });
                req.flash('success', 'Successfully logged in.',)
                // TODO: not hardcode the 'admin' page --> lookup to the original URL
                res.redirect(req.cookies.originalURL)
                console.log('User is logged in.')
                console.log('JWT:', userAccessToken)
            } else {
                console.log('HASH NOT MATCHED. Try it again!')
                console.log('You are not admin nor user!')
                req.flash('error', 'Invalid username or password. Try it again.')
                res.redirect('/login')
            }
        };
        //-------- compare 'username' and 'password' provided by the user --------//
        async function compare() {
            try {
                const username = req.body.username
                const password = req.body.password
                const user = await readData(username)
                const arr = user.Items

                if (arr.length === 0) {
                    console.log('User not found in DB')
                    req.flash('error', 'Invalid username or password. Try it again.')
                    res.redirect('/login')
                } else {
                    await comparePwd(password, savedPassword)
                    // console.log('Read Data:', savedPassword)
                }
            }
            catch (err) {
                console.log('Compare error:', err)
            }
        }
        //-------- compare 'password' provided by the user with 'savedPassword' stored in DB --------//
        compare()

    } catch (err) {
        console.log(`Admin Post login error: ${err.message}`)
    }
})

// TODO: create route for adding username & password to DB
// router.get('/createUser', (req, res) => {
//     const username = req.body.username
//     const password = req.body.password
//     // ---- Hashing password and storing username & password in DB
//     const saltRounds = 10;
//     bcrypt.hash(password, saltRounds, (err, hash) => {
//         const params = {
//             TableName: 'Users',
//             Item: {
//                 'username': { S: username },
//                 'password': { S: hash }
//             }
//         };

//         // Call DynamoDB to add the item to the table
//         ddb.putItem(params, function (err, data) {
//             if (err) {
//                 console.log("DynamoDB Error", err);
//                 console.log(username, password)
//             } else {
//                 console.log("Success", data);
//             }
//         });
//     });

//     // console.log('HASH PWD:', hashedPassword)
//     console.log('post bcrypt', password)
// })


// ------------------- LOGOUT ROUTE - REMOVE JWT COOKIE -------------------//
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
