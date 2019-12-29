const routes = require('express').Router();
const config = require('../shared/config')
const { con, getUser, setUser } = require("../shared/database")
const security = require('../shared/security')

routes.post('/user/signup', async (req, res) => {
    try {
        let body = req.body
        if (body.email && body.password && body.firstname && body.lastname) {
            if (security.emailRegex.test(body.email) && security.passwordRegex.test(body.password)) {
                let user = await getUser(body.email)
                if (user) {
                    res.status(400).send({ ok: false, msg: config.errors.alreadyExists })
                } else {
                    //Same as login but also adding the user to database
                    let hash = await security.bcrypt.hash(body.password, security.saltRounds)
                    let realtoken = security.randomstring.generate(config.tokenLength)
                    let refreshtoken = security.jwt.sign({ token: realtoken }, config.secret, { expiresIn: config.accessExpiry });
                    let refreshArray = [{ token: realtoken, platform: req.body.platform, useragent: req.body.useragent, expiry: new Date(Date.now() + config.refreshExpiry) }]
                    var data = { emailVerified: false, tasks: { test: [{ id: 0, priority: 3, title: "This is your first todo", message: "You should delete this todo" }] } }
                    let newUser = await setUser(body.email, body.firstname, body.lastname, hash, refreshArray, data)
                    let accesstoken = security.jwt.sign({ email: body.email, id: newUser.insertId },
                        config.secret,
                        {
                            expiresIn: config.accessExpiry
                        }
                    );
                    if (!config.production) {
                        console.log("Dev cookies")
                        res.cookie("accesstoken", accesstoken, { expires: new Date(Date.now() + config.accessExpiry), httpOnly: true, path: "/user/" })
                        res.cookie("refreshtoken", refreshtoken, { expires: new Date(Date.now() + config.refreshExpiry), httpOnly: true, path: "/user/refresh" })
                    } else {
                        res.cookie("accesstoken", accesstoken, { expires: new Date(Date.now() + config.accessExpiry), httpOnly: true, path: "/api1/user/", secure: true })
                        res.cookie("refreshtoken", refreshtoken, { expires: new Date(Date.now() + config.refreshExpiry), httpOnly: true, path: "/api1/user/refresh", secure: true })
                    }
                    res.send({ ok: true, id: newUser.insertId, firstname: body.firstname, lastname: body.lastname, data: { emailVerified: false } })
                }
            } else {
                res.status(400).send({ ok: false, msg: config.errors.regexNotMatch })
            }
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (err) {
        console.log("Signup: ", err)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
})


module.exports = routes;