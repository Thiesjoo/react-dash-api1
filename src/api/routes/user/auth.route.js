const routes = require('express').Router();
const Container = require("typedi").Container
const config = Container.get("config")
const auth = require("../../../services/auth.service")

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
 *     JSON: {
 *       "ok": true,
 *       "data": userData
 *     }
 *     Cookie: {
 *          accesstoken,
 *          refreshtoken
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

routes.post('/user/login', async (req, res, next) => {
    try {
        let { email, password, platform, useragent } = req.body
        const { user, accesstoken, refreshtoken } = await auth.login(email, password, platform, useragent)
        res.cookie("accesstoken", accesstoken, { expires: new Date(Date.now() + config.accessExpiry), httpOnly: true, sameSite: config.production ? "none" : "", path: "/user/", secure: config.production })
        res.cookie("refreshtoken", refreshtoken, { expires: new Date(Date.now() + config.refreshExpiry), httpOnly: true, sameSite: config.production ? "none" : "", path: "/user/refresh", secure: config.production })

        res.send({ ok: true, data: user.data })
    } catch (error) {
        next(error)
    }
})


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
 *     JSON: {
 *       "ok": true,
 *       "data": userData
 *     }
 *     Cookie: {
 *          accesstoken,
 *          refreshtoken
 *     }
 *
 * @apiUse AccountDeletionError
 * @apiUse RegexNotMatchError
 * @apiUse NotEnoughInfoError
 * 
 * @apiUse SomethingWentWrongError
 */

routes.post('/user/signup', async (req, res, next) => {
    try {
        let { email, password, firstname, lastname, platform, useragent } = req.body
        const { user, accesstoken, refreshtoken } = await auth.signup(email, password, firstname, lastname, platform, useragent)
        res.cookie("accesstoken", accesstoken, { expires: new Date(Date.now() + config.accessExpiry), httpOnly: true, sameSite: config.production ? "none" : "", path: "/user/", secure: config.production })
        res.cookie("refreshtoken", refreshtoken, { expires: new Date(Date.now() + config.refreshExpiry), httpOnly: true, sameSite: config.production ? "none" : "", path: "/user/refresh", secure: config.production })

        res.send({ ok: true, data: user.data })
    } catch (error) {
        next(error)
    }
})

module.exports = routes;