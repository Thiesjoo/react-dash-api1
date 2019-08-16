//ONLY LOAD ENV FILE WHEN NOT IN PRODUCTION
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const config = require('./config.js');
//EXPRESS SETUP
const express = require('express')
const app = express()
app.use(express.json());
var port = 8080

//DOCKER CHECK
const isDocker = require('is-docker');
var ip = "localhost"
var isdocker = isDocker()
if (isdocker) {
    console.log("Is in docker")
    ip = "db"
}

//MYSQL
var mysql = require('mysql');
var con = mysql.createConnection({
    host: ip,
    user: "nodejs",
    password: config.mysqlPassword,
    database: config.database_name
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to db! at ip", ip);
    var create = "create table if not exists users(id INT AUTO_INCREMENT PRIMARY KEY, email varchar(255), firstname varchar(255),lastname varchar(255),password varchar(255),token varchar(255))"
    simpleQuery(create)
});

function simpleQuery(query) {
    con.query(query, function (err, result) {
        if (err) throw err;
    });
}


//SECURITY

var randomstring = require("randomstring");

//-BCRYPT SETUP
const bcrypt = require('bcrypt');
const saltRounds = config.saltRounds;

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
var errors = { notFound: "Account not found", wrongPassword: "Password is wrong", invalidToken: "Token is invalid", notEnoughInfo: "There is not enough info", noRefresh: "Refresh token doesn't exist", general: "Something went wrong", alreadyExists: "Account already exists", regexNotMatch: "The regex is not valid" }
// /fun[Math.floor(Math.random() * fun.length)]

//-Regex's
const emailRegex = RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
const passwordRegex = RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[0-9]).{5,100}$/
)

//-JWT AND COOKIE Setup
let jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')
app.use(cookieParser())

let checkToken = (req, res, next) => {
    var body = req.body
    var cookies = req.cookies
    console.log("valid cookie in function check token: ", cookies.accesstoken ? "yes" : "no")
    var token = cookies.accesstoken
    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({
                    ok: false,
                    message: errors.invalidToken
                });
            } else {
                //If the decoded token is valid copy it to request and continue
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            ok: false,
            message: errors.notEnoughInfo
        });
    }
};

//-EXPRESS PROTECTION
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
// Helmet
app.use(helmet());
// Rate Limiting
const limit = rateLimit({
    max: 100,// max requests
    windowMs: 60 * 1000, // 1 Hour of 'ban' / lockout 
    message: 'Too many requests' // message to send
});
// Body Parser
app.use(express.json({ limit: '10kb' })); // Body limit is 10
// Data Sanitization against XSS attacks
app.use(xss());


//ROUTES
app.get('/', (req, res) => {
    res.send("test")
})

if (process.env.NODE_ENV !== "production") {
    console.error("USING DEV ROUTES. IF YOU SEE THIS IN PROD YOUR FUCKED")
    console.error("THIS ALSO MEANS THAT: CORS IS ENABLED, DEV ROUTES ARE ON, DEV COOKIES ARE ON, DB IS USING TEST TABLE AND LOCAL ENV IS LOADED ")
    app.get("/delete", (req, res) => {
        simpleQuery("TRUNCATE users;")
        res.send("OK")
    })
    app.get("/list", (req, res) => {
        con.query("SELECT * FROM users", function (err, result) {
            if (err) {
                res.status(404).end()
                throw err
            }
            res.send(result)
        })
    })
}

app.post('/user/login', (req, res) => {
    var body = req.body
    res.cookie("test", "test", { secure: false })
    if (body.email && body.password) {
        //First check if user exists
        if (emailRegex.test(body.email) && passwordRegex.test(body.password)) {
            con.query("SELECT * FROM users WHERE email = ?", [body.email], function (err, result) {
                if (err) {
                    res.status(404).end()
                    throw err
                }
                if (result[0]) {
                    //Compare password and generate token. Then save the token and reutnr the token along with details
                    bcrypt.compare(body.password, result[0].password, function (err, result2) {
                        if (err) {
                            res.status(404).end()
                            throw err
                        }
                        if (result2) {
                            console.log("Login: ", result[0])
                            //FIXME: Put useful data here
                            let accesstoken = jwt.sign({ email: body.email, id: result[0].id },
                                config.secret,
                                {
                                    expiresIn: config.jwtExpiry
                                }
                            );
                            let refreshtoken = randomstring.generate();
                            var query = "UPDATE users SET token = '" + refreshtoken + "' WHERE email = '" + body.email + "'"
                            simpleQuery(query)
                            if (process.env.NODE_ENV !== "production") {
                                console.log("Dev cookies")
                                res.cookie("accesstoken", accesstoken, { expires: new Date(Date.now() + config.accessExpiry), httpOnly: true, path: "/user/" })
                                res.cookie("refreshtoken", refreshtoken, { expires: new Date(Date.now() + config.refreshExpiry), httpOnly: true, path: "/user/refreshAccess" })
                            } else {
                                res.cookie("accesstoken", accesstoken, { expires: new Date(Date.now() + config.accessExpiry), httpOnly: true, path: "/api1/user/", secure: true })
                                res.cookie("refreshtoken", refreshtoken, { expires: new Date(Date.now() + config.refreshExpiry), httpOnly: true, path: "/api1/user/refreshAccess", secure: true })
                            }
                            res.send({ ok: true, firstname: result[0].firstname, lastname: result[0].lastname, id: result[0].id })
                        } else {
                            res.send({ ok: false, msg: errors.wrongPassword })
                        }
                    });
                } else {
                    res.send({ ok: false, msg: errors.notFound })
                }
            });
        } else {
            res.send({ ok: false, msg: errors.regexNotMatch })
        }
    } else {
        res.send({ ok: false, msg: errors.notEnoughInfo })
    }
})

app.post("/user/refreshAccess", (req, res) => {
    var body = req.body
    console.log("Valid cookie in function refresh token: ", req.cookies.refreshtoken ? "yes" : "no")
    if (body.email && req.cookies.refreshtoken) {
        //First check if user exists
        if (emailRegex.test(body.email)) {
            con.query("SELECT * FROM users WHERE email = ?", [body.email], function (err, result) {
                if (err) {
                    res.status(404).end()
                    throw err
                }
                console.log("Refreshing access for: ", result)
                if (result[0].token == req.cookies.refreshtoken) {
                    console.log("Cookie verified")
                    let accesstoken = jwt.sign({ email: body.email, id: result[0].id },
                        config.secret,
                        {
                            expiresIn: config.jwtExpiry
                        }
                    );
                    res.cookie("accesstoken", accesstoken, { expires: new Date(Date.now() + config.accessExpiry), httpOnly: true, path: "/user/" })
                    res.send({ ok: true })
                } else {
                    res.send({ ok: false, msg: errors.noRefresh })
                }
            })
        } else {
            res.send({ ok: false, msg: errors.regexNotMatch })
        }
    } else {
        res.send({ ok: false, msg: errors.notEnoughInfo })
    }
})

app.post('/user/signup', (req, res) => {
    var body = req.body

    if (body.email && body.password && body.firstname && body.lastname) {
        if (emailRegex.test(body.email) && passwordRegex.test(body.password)) {
            con.query("SELECT * FROM users WHERE email = ?", [body.email], function (err, result) {
                if (err) {
                    res.status(404).end()
                    throw err
                }
                if (result[0]) {
                    res.send({ ok: false, msg: errors.alreadyExists })
                } else {
                    //Same as login but also adding the user to database
                    bcrypt.hash(body.password, saltRounds, function (err, hash) {
                        //FIXME: Refreshtoken should be in an array.
                        //FIXME: Refreshtoken should also be jWT???? Or at least exipry with a hash or something
                        let refreshtoken = randomstring.generate();
                        var query = "INSERT INTO users (email, firstname,lastname,password,token) VALUES (?,?,?,?,?)";
                        con.query(query, [body.email, body.firstname, body.lastname, hash, refreshtoken], function (err, result) {
                            if (err) {
                                res.status(404).end()
                                throw err
                            }
                            if (result) {
                                let accesstoken = jwt.sign({ email: body.email, id: result.insertId },
                                    config.secret,
                                    {
                                        expiresIn: config.jwtExpiry
                                    }
                                );
                                if (process.env.NODE_ENV !== "production") {
                                    console.log("Dev cookies")
                                    res.cookie("accesstoken", accesstoken, { expires: new Date(Date.now() + config.accessExpiry), httpOnly: true, path: "/user/" })
                                    res.cookie("refreshtoken", refreshtoken, { expires: new Date(Date.now() + config.refreshExpiry), httpOnly: true, path: "/user/refreshAccess" })
                                } else {
                                    res.cookie("accesstoken", accesstoken, { expires: new Date(Date.now() + config.accessExpiry), httpOnly: true, path: "/api1/user/", secure: true })
                                    res.cookie("refreshtoken", refreshtoken, { expires: new Date(Date.now() + config.refreshExpiry), httpOnly: true, path: "/api1/user/refreshAccess", secure: true })
                                }
                                res.send({ ok: true, id: result.insertId, firstname: body.firstname, lastname: body.lastname })
                            } else {
                                res.send({ ok: false, msg: errors.general })
                            }
                        })
                    });

                }
            })
        } else {
            res.send({ ok: false, msg: errors.regexNotMatch })
        }
    } else {
        res.send({ ok: false, msg: errors.notEnoughInfo })
    }
})

class HandlerGenerator {
    profile(req, res) {
        con.query("SELECT * FROM users WHERE email = ?", [req.decoded.email], function (err, result) {
            if (err) {
                res.status(404).end()
                throw err
            }
            if (result[0]) {
                res.send({ ok: true, data: result.data })
            } else {
                res.send({ ok: false, msg: errors.notFound })
            }
        })
    }
    logout(req, res) {
        if (req.decoded.id === req.body.id) {
            con.query("UPDATE users SET token = '' WHERE id = ?", [req.decoded.id], function (err, result) {
                if (err) {
                    res.status(404).end()
                    throw err
                }
                if (process.env.NODE_ENV !== "production") {
                    console.log("Dev cookies")
                    res.clearCookie("accesstoken", { httpOnly: true, path: "/user/" })
                    res.clearCookie("refreshtoken", { httpOnly: true, path: "/user/refreshAccess" })
                } else {
                    res.clearCookie("accesstoken", { httpOnly: true, path: "/api1/user/", secure: true })
                    res.clearCookie("refreshtoken", { httpOnly: true, path: "/api1/user/refreshAccess", secure: true })
                }
                res.send({ ok: true })
            })
        } else {
            res.send({ ok: false, error: errors.general })
        }
    }
}

let handlers = new HandlerGenerator();
app.post('/user/profile', checkToken, handlers.profile);
app.post('/user/logout', checkToken, handlers.logout);


app.listen(port, () => console.log(`API1 app listening on port ${port}!`))