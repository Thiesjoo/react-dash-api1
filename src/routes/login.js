const routes = require('express').Router();
const config = require('../shared/config')
const { getUserByEmail, updateTokens } = require("../shared/database")
const { bcrypt, jwt, randomstring, emailRegex, passwordRegex } = require('../shared/security')


/**
 * @api {post} /user/login Log in to the api
 * @apiName login
 * @apiGroup User
 *
 * @apiParam {String} email Users unique email.
 * @apiParam {String} password Users password.
 *
 * @apiSuccess {Object} data All the data from the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "ok": true,
 *       "data": userData
 *     }
 *
 * @apiUse UserNotFoundError
 * @apiUse WrongPasswordError
 * @apiUse AccountDeletionError
 * @apiUse RegexNotMatchError
 * @apiUse NotEnoughInfoError
 * 
 * @apiUse SomethingWentWrongError
 */

routes.post('/user/login', async (req, res) => {
    // console.log("Trying to login", req.body)
    try {
        let body = req.body
        if (body.email && body.password) {
            if (emailRegex.test(body.email) && passwordRegex.test(body.password)) {
                // Get the user
                let user = await getUserByEmail(body.email)
                if (user) {
                    if (user.password === "") {
                        if (user.timeOfDeletion) {
                            res.status(401).send({ ok: false, msg: config.errors.accountDeletion})
                        } else {
                            res.status(500).send({ ok: false, msg: config.errors.general })
                        }
                    } else {
                        //Compare password and generate token. Then save the token and return the token along with details
                        let passwordsSame = await bcrypt.compare(body.password, user.password)
                        if (passwordsSame) {
                            let accesstoken = jwt.sign({ email: body.email, id: user._id },
                                config.secret,
                                {
                                    expiresIn: config.accessExpiry
                                }
                            );
                            let realtoken = randomstring.generate(config.tokenLength)
                            let refreshtoken = jwt.sign({ token: realtoken }, config.secret, { expiresIn: config.accessExpiry });
                            let refreshArray = user.token
                            //Add new token
                            refreshArray.push({ token: realtoken, platform: req.body.platform, useragent: req.body.useragent, expiry: new Date(Date.now() + config.refreshExpiry) })

                            //Remove all expired tokens
                            let currentDate = new Date(Date.now())
                            refreshArray = refreshArray.filter(item => item.expiry > currentDate)

                            await updateTokens(user._id, refreshArray)

                            res.cookie("accesstoken", accesstoken, { expires: new Date(Date.now() + config.accessExpiry), httpOnly: true, sameSite: "none", path: "/user/", secure: true })
                            res.cookie("refreshtoken", refreshtoken, { expires: new Date(Date.now() + config.refreshExpiry), httpOnly: true, sameSite: "none", path: "/user/refresh", secure: true })

                            res.send({ ok: true, data: user.data })

                        } else {
                            res.status(404).send({ ok: false, msg: config.errors.wrongPassword })
                        }
                    }
                } else {
                     res.status(404).send({ ok: false, msg: config.errors.accountNotFound })
                }
            } else {
                res.status(400).send({ ok: false, msg: config.errors.regexNotMatch })
            }
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }

    } catch (error) {
        console.error("\x1b[31m Login: ", error)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
})


module.exports = routes;