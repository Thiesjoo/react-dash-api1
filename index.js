// FIXME: Add email status notifactions for account.
//Maybe make seperate server for that(Or worker tthreas)

const config = require('./shared/config.js');
//EXPRESS SETUP
const express = require('express')
const app = express()
app.use(express.json());
app.use("/assets", express.static("assets"))


//-CHANGING HEADERS AND FUN STUFF
// let fun = ["Nice try FBI", "Not today, CIA", "Dirty tricks, MI6", "Not deceptive enough for me, KGB", "Cease to liten what I say, NSA", "Good attempt at obscurity, Department of Homeland Security"]
app.use(function (req, res, next) {
    //These are headers so someone can identify which server is running
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
let cookieParser = require('cookie-parser')
app.use(cookieParser())

//-EXPRESS PROTECTION
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
// Helmet
app.use(helmet());
// Rate Limiting
const limit = rateLimit({
    max: 100,// max re  quests
    windowMs: 60 * 1000, //
    message: { ok: false, msg: config.errors.rateLimit } // message to send
});
app.use("/user/", limit)
// Body Parser
app.use(express.json({ limit: '10kb' })); // Body limit is 10
// Data Sanitization against XSS attacks
app.use(xss());

//ROUTES PREP
const checkToken = require("./shared/security").checkToken

//ROUTES. All auto load from the folders so you don;t have to pay attention when creating a new one
const fs = require("fs")
//All main routes get just used
fs.readdirSync("./routes").forEach(function (file) {
    if (file == "index.js") return;
    if (file.includes("js")) {
        let name = file.substr(0, file.indexOf('.'));
        app.use(require("./routes/" + name))
    }
});


//All files in ./profile get a POST request with fle name and token check, also recursivly checks the subfolders 
fs.readdirSync("./routes/profile").forEach(function (file) {
    if (file.includes("js")) {
        let name = file.substr(0, file.indexOf('.'));
        app.post("/user/" + name, checkToken, require("./routes/profile/" + name))
    } else if (!file.includes(".")) {
        fs.readdirSync("./routes/profile/" + file).forEach(function (file2) {
            if (file2.includes("js")) {
                let name2 = file2.substr(0, file2.indexOf('.'));
                app.post("/user/" + name2, checkToken, require("./routes/profile/" + file + "/" + name2))
            }
        })
    }
});

//All routes in refresh get assigned to /user/refresh, without tokencheck
fs.readdirSync("./routes/refresh").forEach(function (file) {
    if (file.includes("js")) {
        let name = file.substr(0, file.indexOf('.'));
        app.post("/user/refresh/" + name, require("./routes/refresh/" + name))
    }
})

app.listen(config.expressPort, () => console.log(`API1 app listening on port ${config.expressPort}!`))