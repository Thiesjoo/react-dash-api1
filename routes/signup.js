const routes = require('express').Router();
const config = require('../shared/config')
const { getUserByEmail, addUser } = require("../shared/database")
const security = require('../shared/security')

routes.post('/user/signup', async (req, res) => {
    try {
        let body = req.body
        if (body.email && body.password && body.firstname && body.lastname) {
            if (security.emailRegex.test(body.email) && security.passwordRegex.test(body.password)) {
                let user = await getUserByEmail(body.email)
                if (user) {
                    if (user.timeOfDeletion) {
                        const diffTime = Math.abs(Date.now() - user.timeOfDeletion);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        res.status(401).send({ ok: false, msg: `This account was deleted ${diffDays} days ago. It is blocked due to user spoofing reasons` })
                    } else {
                        res.status(400).send({ ok: false, msg: config.errors.alreadyExists })
                     }
                } else {
                    //Same as login but also adding the user to database
                    let hash = await security.bcrypt.hash(body.password, security.saltRounds)
                    let realtoken = security.randomstring.generate(config.tokenLength)
                    let refreshtoken = security.jwt.sign({ token: realtoken }, config.secret, { expiresIn: config.accessExpiry });
                    let refreshArray = [{ token: realtoken, platform: req.body.platform, useragent: req.body.useragent, expiry: new Date(Date.now() + config.refreshExpiry) }]

                    let newUser = await addUser(body.email, body.firstname, body.lastname, hash, refreshArray)
                    let accesstoken = security.jwt.sign({ email: body.email, id: newUser._id },
                        config.secret,
                        {
                            expiresIn: config.accessExpiry
                        }
                    );

                    res.cookie("accesstoken", accesstoken, { expires: new Date(Date.now() + config.accessExpiry), httpOnly: true, path: "/user/", sameSite: "none", secure: true })
                    res.cookie("refreshtoken", refreshtoken, { expires: new Date(Date.now() + config.refreshExpiry), httpOnly: true, path: "/user/refresh", sameSite: "none", secure: true })

                    res.send({ ok: true, data: newUser.data })
                }
            } else {
                res.status(400).send({ ok: false, msg: config.errors.regexNotMatch })
            }
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (err) {
        console.log("\x1b[31m Signup: ", err)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
})


module.exports = routes;