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
    password: "NodeJsPassword",
    database: "users_test"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to db! at ip", ip);
    var create = "create table if not exists users(email varchar(255), firstname varchar(255),lastname varchar(255),password varchar(255),token varchar(255),data varchar(255))"
    simpleQuery(create)
});

function simpleQuery(query) {
    con.query(query, function (err, result) {
        if (err) throw err;
    });
}


//SECURITY
//-BCRYPT SETUP
const bcrypt = require('bcrypt');
const saltRounds = 10;

//-CHANGING HEADERS AND FUN STUFF
var fun = [ "Nice try FBI", "Not today, CIA",   "Dirty tricks, MI6" , "Not deceptive enough for me, KGB", "Cease to liten what I say, NSA","Good attempt at obscurity, Department of Homeland Security"]
app.use(function (req, res, next) {
    console.log("Got request here")
    //THESE ARE JUST FUNNY HEADERS
    res.setHeader('X-Powered-By', 'Commodore 64')
    res.setHeader('If-You-Read-This', "you're really good at going into developer tools and pressing network")
    res.setHeader("Try", "Again another time")
    res.setHeader("Server", "Try again another time")

    if (!isdocker) {
        //These are the functional headers that enable CORS when in test mode
        console.log("Using access control headers")
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "DELETE, GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }
    next()
})

//-Regex's
const emailRegex = RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
const passwordRegex = RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[0-9]).{5,100}$/
)

//-JWT Setup
let jwt = require('jsonwebtoken');
const config = require('./config.js');

let checkToken = (req, res, next) => {
    var body = req.body
    //CHECK IF THERE IS A TOKEN
    console.log(req.headers["authorization"])
    let token = req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    console.log()
    if (token && body.email) {
        if (emailRegex.test(body.email)) {
            jwt.verify(token, config.secret+body.email, (err, decoded) => {
                if (err) {
                    return res.json({
                        ok: false,
                        message: 'Token is not valid'
                    });
                } else {
                    //If the decoded token is valid copy it to request and continue
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.send({ ok: false, msg:fun[Math.floor(Math.random() * fun.length)]})
        }
    } else {
        return res.json({
            ok: false,
            message: 'Token or email is not supplied'
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
    //This is a simple route that select all users and passes them (ONLY FOR TESTING)
    //FIXME: REMOVE ON PUBLISH
    con.query("SELECT * FROM users", function (err, result) {
        if (err) throw err;
        //console.log(result)
        res.send('Hello World! ' + JSON.stringify(result))
    });
})

app.post('/user/login', (req, res) => {
    var body = req.body
    if (body.email && body.password) {
        //FIXME: CHECK IF REGEX IS CORRRECT
        //FIrst check if user exists
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
                            //FIXME: Put useful data here
                            let token = jwt.sign({ email: body.email },
                                config.secret + body.email,
                                {
                                    expiresIn: '24h' // expires in 24 hours
                                }
                            );
                            var query = "UPDATE users SET token = '" + token + "' WHERE email = '" + body.email + "'"
                            simpleQuery(query)
                            res.send({ ok: true, data: result[0].data, token: token, firstname: result[0].firstname, lastname: result[0].lastname })
                        } else {
                            res.send({ ok: false, msg: "Wrong password" })
                        }
                    });
                } else {
                    res.send({ ok: false, msg: "Account doesn't exist" })
                }
            });
        } else {
            res.send({ ok: false, msg: fun[Math.floor(Math.random() * fun.length)] })
        }
    } else {
        res.send({ ok: false, msg: "Not enough data" })
    }
})

app.post('/user/signup', (req, res) => {
    var body = req.body

    if (body.email && body.password && body.firstname && body.lastname) {
        //FIXME: CHECK IF REGEX IS CORRRECT
        if (emailRegex.test(body.email) && passwordRegex.test(body.password)) {


            con.query("SELECT * FROM users WHERE email = ?", [body.email], function (err, result) {
                if (err) {
                    res.status(404).end()
                    throw err
                }
                if (result[0]) {
                    res.send({ ok: false, msg: "Account already exists" })
                } else {
                    //Same as login but also adding the user to database
                    bcrypt.hash(body.password, saltRounds, function (err, hash) {

                        // Store hash in your password DB.
                        //FIXME: Generate a token with time build in
                        let token = jwt.sign({ email: body.email },
                            config.secret,
                            {
                                expiresIn: '24h' // expires in 24 hours
                            }
                        );
                        console.log(hash.length, token.length)
                        var query = "INSERT INTO users (email, firstname,lastname,password,token) VALUES (?,?,?,?,?)";
                        con.query(query, [body.email, body.firstname, body.lastname, hash, token], function (err, result) {
                            if (err) {
                                res.status(404).end()
                                throw err
                            }
                            if (result) {
                                res.send({ ok: true, data: null, token: token, firstname: result.firstname, lastname: result.lastname })
                            } else {
                                res.send({ ok: false, msg: "Something went wrong with the database" })
                            }
                        })
                    });

                }
            })
        } else {
            res.send({ ok: false, msg: fun[Math.floor(Math.random() * fun.length)] })
        }
    } else {
        res.send({ ok: false, msg: "Not enough data" })
    }
})

class HandlerGenerator {
    profile(req, res) {
        con.query("SELECT * FROM users WHERE email = ?", [req.decoded.email], function (err, result) {
            if (err) {
                res.status(404).end()
                throw err
            }
            console.log("Succesfull profile post")
            if (result[0]) {
                res.send({ ok: true, data: result.data })
            } else {
                res.send({ ok: false, msg: "Profile not found" })
            }
        })

    }
}

let handlers = new HandlerGenerator();
app.post('/user/profile', checkToken, handlers.profile);

app.listen(port, () => console.log(`API1 app listening on port ${port}!`))