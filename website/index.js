const mongoose = require('mongoose')
const express = require('express')
const app = express()

//packages
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
app.use("/icons", express.static("node_modules/boxicons"))
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
require("dotenv").config()

// Connect to MongoDB
mongoose.connect(process.env.DATABASE, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true
}).then(() => {
    console.log("DB CONNECTED")
}).catch(() => {
    console.log("DB CONNECTION FAILED")
})

// Use parsing Middleware
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

// Import Routes
const userRoutes = require("./routes/user")
const companyRoutes = require("./routes/company")
const categoryRoutes = require("./routes/category")
const listenerRoutes = require("./routes/listener")
const keywordRoutes = require("./routes/keyword")

// Using Routes
app.use("/user", userRoutes)
app.use("/company", companyRoutes)
app.use("/category", categoryRoutes)
app.use("/listener", listenerRoutes)
app.use("/keyword", keywordRoutes)

// Views
app.use(express.static(path.join(__dirname, 'views')))
app.get('/view/login', (req,res) => {
    res.sendFile(path.join(__dirname, 'views/pages/login.html'))
})
app.get('/view/register', (req,res) => {
    res.sendFile(path.join(__dirname, 'views/pages/register.html'))
})
app.get('/view/dashboard', (req,res) => {
    res.sendFile(path.join(__dirname, 'views/pages/dashboard.html'))
})

//get data from database
const listener = require('./models/listenerModel')
app.get('/listener-data', (req, res) => {
    //get data from database
    listener.find({company_id: req.body.company_id}, (err, data) => {
        if(err) {
            console.log(err)
        } else {
            res.send(req.session)
        }
    })
})



//Start the server
const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})