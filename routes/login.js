const routes = require('express').Router();
const config = require('../shared/config')
const { simpleQuery2, getUser } = require("../shared/database")
const { bcrypt, jwt, randomstring, emailRegex, passwordRegex } = require('../shared/security')

routes.post('/user/login', async (req, res) => {
    try {
        var body = req.body
        if (body.email && body.password) {
            //First check if user exists
            if (emailRegex.test(body.email) && passwordRegex.test(body.password)) {
                // Get the user
                var user = await getUser(body.email)
                if (user) {
                    //Compare password and generate token. Then save the token and reutnr the token along with details
                    var passwordsSame = await bcrypt.compare(body.password, user.password)
                    if (passwordsSame) {
                        let accesstoken = jwt.sign({ email: body.email, id: user.id },
                            config.secret,
                            {
                                expiresIn: config.accessExpiry
                            }
                        );
                        var realtoken = randomstring.generate(config.tokenLength)
                        let refreshtoken = jwt.sign({ refreshtoken: realtoken }, config.secret, { expiresIn: config.accessExpiry });
                        var refreshArray = JSON.parse(user.token)
                        refreshArray.push({ token: realtoken, platform: req.body.platform, useragent: req.body.useragent, expiry: new Date(Date.now() + config.refreshExpiry) })
                        var query = "UPDATE users SET token = '" + JSON.stringify(refreshArray) + "' WHERE email = '" + body.email + "'"
                        await simpleQuery2(query)
                        if (process.env.NODE_ENV !== "production") {
                            //Differnet cookies for dev, cuz api url is different(And not secure)
                            console.log("Dev cookies")
                            res.cookie("accesstoken", accesstoken, { expires: new Date(Date.now() + config.accessExpiry), httpOnly: true, path: "/user/" })
                            res.cookie("refreshtoken", refreshtoken, { expires: new Date(Date.now() + config.refreshExpiry), httpOnly: true, path: "/user/refresh" })
                        } else {
                            res.cookie("accesstoken", accesstoken, { expires: new Date(Date.now() + config.accessExpiry), httpOnly: true, path: "/api1/user/", secure: true })
                            res.cookie("refreshtoken", refreshtoken, { expires: new Date(Date.now() + config.refreshExpiry), httpOnly: true, path: "/api1/user/refresh", secure: true })
                        }
                        res.send({ ok: true, firstname: user.firstname, lastname: user.lastname, id: user.id, data: user.data })

                        var allTokens = JSON.parse(user.token)
                        var currentDate = new Date(Date.now())
                        allTokens.forEach(x => {
                            if (x.expiry < currentDate) {
                                console.log("This token expired")
                            }
                        })
                        //FIXME: Should do something
                    } else {
                        res.send({ ok: false, msg: config.errors.wrongPassword })
                    }
                } else {
                    res.send({ ok: false, msg: config.errors.accountNotFound })

                }
            } else {
                res.send({ ok: false, msg: config.errors.regexNotMatch })
            }
        } else {
            res.send({ ok: false, msg: config.errors.notEnoughInfo })
        }

    } catch (error) {
        console.log("Login: ", error, body)
        res.send({ ok: false, msg: config.errors.general })
    }
})


module.exports = routes;