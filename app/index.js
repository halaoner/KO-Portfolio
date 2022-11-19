const express = require('express')
const ejsMate = require('ejs-mate')
const path = require('path')
const cookieParser = require('cookie-parser')
const adminRoute = require('./routes/admin')
const userRoute = require('./routes/user')
const flash = require('connect-flash')
const session = require('express-session')

//------- .ENV CONFIGURATION -------//
require('dotenv').config()
const PORT = process.env.PORT
const SESSION_SECRET = process.env.SESSION_SECRET

const app = express()
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser());
app.use(session({
    secret: SESSION_SECRET,
    saveUninitialized: true,
    resave: true
}));

app.use(flash())

//---- Flash message middleware -----//
app.use(function (req, res, next) {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//------------- ROUTES -------------//
app.use(adminRoute)
app.use(userRoute)

app.get('/', (req, res) => {
    res.render('home')
})

//--- If none of above route is matched
app.all('*', (req, res) => {
    res.status(404).send('Page Not Found')
})

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT} 🚀`)
})
