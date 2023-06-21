const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const routeURLs = require('./routes/routes')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { requireAuth } = require('./middleware/authMiddleware');

//connecting database
dotenv.config()
mongoose.connect(process.env.DB_ACCESS, ()=>console.log('db connected')) 
//middleware
app.use(express.json())
/* app.use(bodyParser.json({strict: false}));
app.use(bodyParser.json()) */
app.use(cors())






//listening
app.use('/admin', routeURLs)
app.listen(5000, () => console.log('server running') )

//Cookies
app.use(cookieParser());

app.get('/admin/dashboard', requireAuth, (req, res) => {console.log('You are now HOME')});