const routes = require('express').Router();
const config = require('../shared/config')
const con = require("../shared/database").con
const simpleQuery = require("../shared/database").simpleQuery
const security = require('../shared/security')

routes.post('/user/login', (req, res) => {
    var body = req.body
    res.cookie("test", "test", { secure: false })
    if (body.email && body.password) {
        //First check if user exists
        if (security.emailRegex.test(body.email) && security.passwordRegex.test(body.password)) {
            con.query("SELECT * FROM users WHERE email = ?", [body.email], function (err, result) {
                if (err) {
                    res.status(404).end()
                    throw err
                }
                if (result[0]) {
                    //Compare password and generate token. Then save the token and reutnr the token along with details
                    security.bcrypt.compare(body.password, result[0].password, function (err, result2) {
                        if (err) {
                            res.status(404).end()
                            throw err
                        }
                        if (result2) {
                            // console.log("Login: ", result[0])
                            let accesstoken = security.jwt.sign({ email: body.email, id: result[0].id },
                                config.secret,
                                {
                                    expiresIn: config.accessExpiry
                                }
                            );
                            var realtoken = security.randomstring.generate(config.tokenLength)
                            let refreshtoken = security.jwt.sign({ refreshtoken: realtoken }, config.secret, { expiresIn: config.accessExpiry });
                            var refreshArray = JSON.parse(result[0].token)
                            refreshArray.push({token: realtoken, platform: req.body.platform, useragent: req.body.useragent, date: new Date().getTime})
                            var query = "UPDATE users SET token = '" + JSON.stringify(refreshArray) + "' WHERE email = '" + body.email + "'"
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
                            res.send({ ok: false, msg: config.errors.wrongPassword })
                        }
                    });
                } else {
                    res.send({ ok: false, msg: config.errors.notFound })
                }
            });
        } else {
            res.send({ ok: false, msg: config.errors.regexNotMatch })
        }
    } else {
        res.send({ ok: false, msg: config.errors.notEnoughInfo })
    }
})


module.exports = routes;