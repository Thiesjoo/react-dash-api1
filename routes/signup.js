const routes = require('express').Router();
const config = require('../shared/config')
const con = require("../shared/database").con
const security = require('../shared/security')

routes.post('/user/signup', (req, res) => {
    var body = req.body
    if (body.email && body.password && body.firstname && body.lastname) {
        if (security.emailRegex.test(body.email) && security.passwordRegex.test(body.password)) {
            con.query("SELECT * FROM users WHERE email = ?", [body.email], function (err, result) {
                if (err) {
                    res.status(404).end()
                    throw err
                }
                if (result[0]) {
                    res.send({ ok: false, msg: config.errors.alreadyExists })
                } else {
                    //Same as login but also adding the user to database
                    security.bcrypt.hash(body.password, security.saltRounds, function (err, hash) {
                        var realtoken = security.randomstring.generate(config.tokenLength)
                        let refreshtoken = security.jwt.sign({ refreshtoken: realtoken }, config.secret, { expiresIn: config.accessExpiry });
                        var refreshArray = [{token: realtoken, platform: req.body.platform, useragent: req.body.useragent, date: new Date().getTime}]
                        var query = "INSERT INTO users (email, firstname,lastname,password,token) VALUES (?,?,?,?,?)";
                        con.query(query, [body.email, body.firstname, body.lastname, hash, JSON.stringify(refreshArray)], function (err, result) {
                            if (err) {
                                res.status(404).end()
                                throw err
                            }
                            if (result) {
                                let accesstoken = security.jwt.sign({ email: body.email, id: result.insertId },
                                    config.secret,
                                    {
                                        expiresIn: config.accessExpiry
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
                                res.send({ ok: false, msg: config.errors.general })
                            }
                        })
                    });

                }
            })
        } else {
            res.send({ ok: false, msg: config.errors.regexNotMatch })
        }
    } else {
        res.send({ ok: false, msg: config.errors.notEnoughInfo })
    }
})


module.exports = routes;