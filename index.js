// FIXME: Add email status notifactions for account.
//Maybe make seperate server for that(Or worker tthreas)

//ONLY LOAD ENV FILE WHEN NOT IN PRODUCTION
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const config = require('./shared/config.js');
//EXPRESS SETUP
const express = require('express')
const app = express()
app.use(express.json());

//-CHANGING HEADERS AND FUN STUFF
var fun = ["Nice try FBI", "Not today, CIA", "Dirty tricks, MI6", "Not deceptive enough for me, KGB", "Cease to liten what I say, NSA", "Good attempt at obscurity, Department of Homeland Security"]
app.use(function (req, res, next) {
    //THESE ARE JUST FUNNY HEADERS
    res.setHeader('X-Powered-By', 'Commodore 64')
    res.setHeader('If-You-Read-This', "you're 'smart'")
    res.setHeader("Server", "Commodore 64")

    if (process.env.NODE_ENV !== "production") {
        //These are the functional headers that enable CORS when in test mode
        if (req.headers.origin) {
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin)
        } else {
            res.setHeader("Access-Control-Allow-Origin", "*")
        }
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "DELETE, GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }
    next()
})


//Cookie setup
var cookieParser = require('cookie-parser')
app.use(cookieParser())

//-EXPRESS PROTECTION
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
// Helmet
app.use(helmet());
// Rate Limiting
const limit = rateLimit({
    max: 100,// max requests
    windowMs: 60 * 1000, //
    message: 'Too many requests' // message to send
});
app.use(limit)
// Body Parser
app.use(express.json({ limit: '10kb' })); // Body limit is 10
// Data Sanitization against XSS attacks
app.use(xss());

//ROUTES PREP
const checkToken = require("./shared/security").checkToken

//ROUTES. All auto load from the folders so you don;t have to pay attention when creating a new one
const fs = require("fs")
fs.readdirSync("./routes").forEach(function(file) {
    if (file == "index.js") return;
    if (file.includes("js")) {
        var name = file.substr(0, file.indexOf('.'));
        if (name.includes("dev") && process.env.NODE_ENV !== "production") {
            app.use(require("./routes/"+name))
        } else {
            app.use(require("./routes/"+name))
        }
    }
});

fs.readdirSync("./routes/profile").forEach(function(file) {
    if (file.includes("js")) {
        var name = file.substr(0, file.indexOf('.'));
        if (name.toLowerCase().includes("refresh")) {
            app.post("/user/refresh/"+name, require("./routes/profile/"+name))
        } else {
            app.post("/user/"+name, checkToken, require("./routes/profile/"+name))
        }
    }
});

app.listen(config.expressPort, () => console.log(`API1 app listening on port ${config.expressPort}!`))