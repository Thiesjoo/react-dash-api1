// TODO: Add email status notifactions for account.

const config = require('./shared/config.js');
//EXPRESS SETUP
const express = require('express')
const app = express()

//-CHANGING HEADERS AND FUN STUFF
// app.use(function (req, res, next) {
//     //These are headers so someone can identify which server is running
//     res.setHeader("Server", "Commodore 64")

//     if (!config.production || config.zeit) {
//         //These are the functional headers that enable CORS when in test mode
//         if (req.headers.origin) {
//             res.setHeader("Access-Control-Allow-Origin", req.headers.origin)
//         } else {
//             res.setHeader("Access-Control-Allow-Origin", "*")
//         }
//         res.setHeader("Access-Control-Allow-Credentials", "true");
//         res.setHeader("Access-Control-Allow-Methods", "DELETE, GET, POST, OPTIONS, PATCH, PUT");
//         res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     }
//     next()
// })
// const whitelist = ["https://react-dash.now.sh/"]
// const cors = require("cors")
// app.use(cors({
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// }))

// app.options('*', cors());



//Cookie setup
let cookieParser = require('cookie-parser')
app.use(cookieParser())

//-EXPRESS PROTECTION
const helmet = require('helmet');
const xss = require('xss-clean');
app.use(helmet());
app.use(xss());

app.use(express.json({ limit: '5kb' })); // Body limit is 5kb too protect against large files

//settings
const { checkToken, checkAdmin } = require("./shared/security")

//Don't cache any response, every request is different
const nocache = require('nocache');
app.use(nocache());
app.set("etag", false)

//Online logging
const statusMonitor = require('express-status-monitor')({ path: '', ignoreStartsWith: "/admin" });
app.use(statusMonitor);

/**
* @api {get} /status Return a webpage with app status
* @apiName Stats
* @apiPermission admin
* @apiGroup Monitoring
*/

app.get('/status', checkToken, checkAdmin, statusMonitor.pageRoute)


//ROUTES PREP
/**
* @api {get} / Returns a simple JSON message with "Hello world!"
* @apiName home
* @apiGroup public
*/

app.get('/', (req, res) => {
    console.log("Get request on server. IP: ", req.ip)
    res.send({ ok: true, msg: "Hello world!" })
})


//ROUTES. All auto load from the folders so you don;t have to pay attention when creating a new one
const fs = require("fs")

//All main routes get just used (Login, Signup)
fs.readdirSync("./routes").forEach(function (file) {
    if (file.slice(-3) === ".js") {
        let name = file.substr(0, file.indexOf('.'));
        app.use(require("./routes/" + name))
    }
});


//Recursivly check the subfolders and give them the correct method
fs.readdirSync("./routes/profile").forEach(function (file) {
    fs.readdirSync("./routes/profile/" + file).forEach(function (file2) {
        if (file2.includes("js")) {
            let fileName = file2.substr(0, file2.indexOf('.'));
            addCorrectMethod(fileName, "profile/" + file + "/" + file2)
        }
    })
});

//All routes in refresh get assigned to /user/refresh, without tokencheck
fs.readdirSync("./routes/refresh").forEach(function (file) {
    if (file.includes("js")) {
        let name = file.substr(0, file.indexOf('.'));
        app.post("/user/refresh/" + name, require("./routes/refresh/" + file))
    }
})

function addCorrectMethod(name, path) {
    const items = name.includes("List") || name.includes("Order")
    const endUrl = `/user/profile/item${items ? "s" : ""}`
    if (name.includes("get")) {
        app.get(endUrl, checkToken, require("./routes/" + path))
    } else if (name.includes("delete")) {
        app.delete(endUrl, checkToken, require("./routes/" + path))
    } else if (name.includes("add")) {
        app.post(endUrl, checkToken, require("./routes/" + path))
    } else if (name.includes("Order")) {
        app.patch(endUrl, checkToken, require("./routes/" + path))
    } else if (name.includes("update")) {
        app.put(endUrl, checkToken, require("./routes/" + path))
    }
}

const init = require("./shared/database").init
init(app).catch(error => { throw error })

let server = null

//Wait for the database to be connected before accepting requests
app.on('ready', function () {
    server = app.listen(config.port, () => {
        console.log("API1 (For react-dash) running on port " + config.port)
    })
})

process.on('exit', function () {
    gracefulShutdown()
});

process.once('SIGUSR2', function () {
    gracefulShutdown(function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});

function gracefulShutdown(callback) {
    console.log("Closing server gracefully")
    if (server) server.close()
    callback()
}
