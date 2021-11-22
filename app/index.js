const express = require('express')
const ejsMate = require('ejs-mate')
const path = require('path')
const cookieParser = require('cookie-parser');
const router = express.Router()
const route = require('./routes/routes')
const adminRoute = require('./routes/admin');

//------- .ENV CONFIGURATION -------//
require('dotenv').config()
const PORT = process.env.PORT

const app = express()
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser());

//------------- ROUTES -------------//
app.use('/', route)
app.use(adminRoute)
// app.use('/home', route)

// app.get('/home', (req, res) => {
//     res.send('Home Page')
// })

app.get('/projects', (req, res) => {
    res.send('Projects page')
})

app.get('/about', (req, res) => {
    res.send('Aboutme')
})

//--- If none of above paths is matched
app.all('*', (req, res) => {
    res.status(404).send('Page Not Found')
})

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT} 🚀`)
})
