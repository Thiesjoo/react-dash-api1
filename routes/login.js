const routes = require('express').Router();
const config = require('../shared/config')
const { simpleQuery, getUser } = require("../shared/database")
const { bcrypt, jwt, randomstring, emailRegex, passwordRegex } = require('../shared/security')

routes.post('/user/login', async (req, res) => {
    // console.log("Trying to login", req.body)
    try {
        let body = req.body
        if (body.email && body.password) {
            //First check if user exists
            if (emailRegex.test(body.email) && passwordRegex.test(body.password)) {
                // Get the user
                let user = await getUser(body.email)
                if (user) {
                    //Compare password and generate token. Then save the token and reutnr the token along with details
                    let passwordsSame = await bcrypt.compare(body.password, user.password)
                    if (passwordsSame) {
                        let accesstoken = jwt.sign({ email: body.email, id: user.id },
                            config.secret,
                            {
                                expiresIn: config.accessExpiry
                            }
                        );
                        let realtoken = randomstring.generate(config.tokenLength)
                        let refreshtoken = jwt.sign({ token: realtoken }, config.secret, { expiresIn: config.accessExpiry });
                        let refreshArray = JSON.parse(user.token)
                        refreshArray.push({ token: realtoken, platform: req.body.platform, useragent: req.body.useragent, expiry: new Date(Date.now() + config.refreshExpiry) })
                        
                        
                        let query = "UPDATE users SET token = '" + JSON.stringify(refreshArray) + "' WHERE email = '" + body.email + "'"
                        await simpleQuery(query)

                        res.cookie("accesstoken", accesstoken, { expires: new Date(Date.now() + config.accessExpiry), httpOnly: true, sameSite: "none", path: "/user/", secure: true })
                        res.cookie("refreshtoken", refreshtoken, { expires: new Date(Date.now() + config.refreshExpiry), httpOnly: true, sameSite: "none", path: "/user/refresh", secure: true })
                       
                        res.send({ ok: true, firstname: user.firstname, lastname: user.lastname, id: user.id, data: user.data })

                        let allTokens = JSON.parse(user.token)
                        let currentDate = new Date(Date.now())
                        allTokens.forEach(x => {
                            if (x.expiry < currentDate) {
                                console.log("This token expired")
                            }
                        })
                        //FIXME: Should do something
                    } else {
                        res.status(400).send({ ok: false, msg: config.errors.wrongPassword })
                    }
                } else {
                    res.status(400).send({ ok: false, msg: config.errors.accountNotFound })
                }
            } else {
                res.status(400).send({ ok: false, msg: config.errors.regexNotMatch })
            }
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }

    } catch (error) {
        console.error("\x1b[31mLogin: ", error)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
})


module.exports = routes;