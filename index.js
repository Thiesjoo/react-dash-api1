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
    res.setHeader("Server", "Commodore 64")

    if (!config.production || config.zeit) {
        //These are the functional headers that enable CORS when in test mode
        if (req.headers.origin) {
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin)
        } else {
            res.setHeader("Access-Control-Allow-Origin", "*")
        }
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "DELETE, GET, POST, OPTIONS, PATCH, PUT");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }
    next()
})


//Cookie setup
let cookieParser = require('cookie-parser')
app.use(cookieParser())

//-EXPRESS PROTECTION
const helmet = require('helmet');
const xss = require('xss-clean');
// Helmet
app.use(helmet());

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
        if (name.includes("dev") && !config.production) {
            app.use(require("./routes/" + name))
        } else if (!name.includes("dev")) {
            app.use(require("./routes/" + name))
        }
    }
});

//All files in ./profile get a POST request with fle name and token check, also recursivly checks the subfolders 
fs.readdirSync("./routes/profile").forEach(function (file) {
    if (file.includes("js")) {
        let name = file.substr(0, file.indexOf('.'));
        app.post("/user/" + name, checkToken, require("./routes/profile/" + file))
    } else if (!file.includes(".")) {
        fs.readdirSync("./routes/profile/" + file).forEach(function (file2) {
            if (file2.includes("js")) {
                let fileName = file2.substr(0, file2.indexOf('.'));
                addCorrectMethod("profile/" + fileName, "profile/" + file + "/" + file2)
            }
        })
    }
});

//All routes in refresh get assigned to /user/refresh, without tokencheck
fs.readdirSync("./routes/refresh").forEach(function (file) {
    if (file.includes("js")) {
        let name = file.substr(0, file.indexOf('.'));
        app.post("/user/refresh/" + name, require("./routes/refresh/" + file))
    }
})

function addCorrectMethod(name, path) {
    if (name.includes("get")) {
        app.get("/user/profile/item", checkToken, require("./routes/" + path))
    } else if (name.includes("delete")) {
        app.delete("/user/profile/item", checkToken, require("./routes/" + path))
    } else if (name.includes("add")) {
        app.post("/user/profile/item", checkToken, require("./routes/" + path))
    } else if (name.includes("Order")) {
        app.patch("/user/profile/item", checkToken, require("./routes/" + path))
    }else if (name.includes("update")) {
        app.put("/user/profile/item", checkToken, require("./routes/" + path))
    }
}

//Certs
const https = require('https');

const privateKey = fs.readFileSync('certs/privkey.pem', 'utf8');
const certificate = fs.readFileSync('certs/cert.pem', 'utf8');
const ca = fs.readFileSync('certs/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(config.httpsPort, () => console.log(`API1 https-app listening on port ${config.httpsPort}!`))