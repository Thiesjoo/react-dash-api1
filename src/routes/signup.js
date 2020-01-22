const routes = require('express').Router();
const config = require('../shared/config')
const { getUserByEmail, addUser } = require("../shared/database")
const security = require('../shared/security')


/**
 * @api {post} /user/signup Signup to the api
 * @apiName signup
 * @apiGroup User
 *
 * @apiParam {String} email Users unique email.
 * @apiParam {String} password Users password.
 * @apiParam {String} firstname Users first name.
 * @apiParam {String} lastname Users last name.
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
 * @apiUse AccountDeletionError
 * @apiUse RegexNotMatchError
 * @apiUse NotEnoughInfoError
 * 
 * @apiUse SomethingWentWrongError
 */

routes.post('/user/signup', async (req, res) => {
    try {
        let body = req.body
        if (body.email && body.password && body.firstname && body.lastname) {
            if (security.emailRegex.test(body.email) && security.passwordRegex.test(body.password)) {
                let user = await getUserByEmail(body.email)
                if (user) {
                    if (user.timeOfDeletion) {
                        res.status(401).send({ ok: false, msg: config.errors.accountDeletion })
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

                    res.cookie("accesstoken", accesstoken, { expires: new Date(Date.now() + config.accessExpiry), httpOnly: true, path: "/user/", samesite: config.production ? "none" : "", secure: config.production })
                    res.cookie("refreshtoken", refreshtoken, { expires: new Date(Date.now() + config.refreshExpiry), httpOnly: true, path: "/user/refresh", samesite: config.production ? "none" : "", secure: config.production })

                    res.send({ ok: true, data: newUser.data })
                }
            } else {
                res.status(400).send({ ok: false, msg: config.errors.regexNotMatch })
            }
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (err) {
        console.error("\x1b[31m Signup: ", err)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
})


module.exports = routes;