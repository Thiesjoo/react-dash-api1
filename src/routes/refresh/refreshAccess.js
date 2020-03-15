const security = require('../../shared/security')
const { getUserByEmail } = require("../../shared/database")
const config = require('../../shared/config')

/**
 * @api {post} /user/refresh/refreshAccess Refresh the accesstoken
 * @apiName refreshAccess
 * @apiGroup refresh
 * @apiHeader {String} Cookie:accesstoken Users unique access-token.
 * @apiHeader {String} Cookie:refreshtoken Users unique refresh-token.
 *
 * @apiParam {String} email Users unique email.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     JSON: {
 *       "ok": true
 *     }
 *     Cookie: {
 *          accesstoken,
 *          refreshtoken
 *     }
 *
 * @apiUse UserNotFoundError
 * @apiUse RegexNotMatchError
 * @apiUse NotEnoughInfoError
 * @apiUse InvalidToken
 * @apiUse NotEnoughPermissions
 * 
 * @apiUse SomethingWentWrongError
 */


async function refreshAccess(req, res) {
    try {
        let body = req.body
        if (body.email && req.cookies.refreshtoken) {
            //First check if user exists
            if (security.emailRegex.test(body.email)) {
                let user = await getUserByEmail(body.email)
                if (user) {
                    console.log("Refreshing access for: ", user._id)
                    let refreshtoken = security.jwt.verify(req.cookies.refreshtoken, config.secret)
                    if (refreshtoken) {
                        let refreshArray = user.token
                        let findTokenResult = refreshArray.find(x => x.token === refreshtoken.token);
                        if (findTokenResult) {
                            let accesstoken = security.jwt.sign({ email: body.email, id: user._id },
                                config.secret,
                                {
                                    expiresIn: config.accessExpiry
                                }
                            );
                            res.cookie("accesstoken", accesstoken, { expires: new Date(Date.now() + config.accessExpiry), httpOnly: true, secure: config.production, sameSite: config.production ? "none" : "", path: "/user/" })
                            res.send({ ok: true })
                        } else {
                            res.clearCookie("refreshtoken", { httpOnly: true, path: "/user/refreshAccess", sameSite: config.production ? "none" : "", secure: config.production })
                            res.status(401).send({ ok: false, msg: config.errors.noPerms })
                        }
                    } else {
                        res.clearCookie("refreshtoken", { httpOnly: true, path: "/user/refreshAccess", sameSite: config.production ? "none" : "", secure: config.production })
                        return res.status(401).send({
                            ok: false,
                            message: config.errors.invalidToken
                        });
                    }
                } else {
                    res.clearCookie("refreshtoken", { httpOnly: true, path: "/user/refreshAccess", sameSite: config.production ? "none" : "", secure: config.production })
                     res.status(404).send({ ok: false, msg: config.errors.accountNotFound })
                }
            } else {
                res.clearCookie("refreshtoken", { httpOnly: true, path: "/user/refreshAccess", sameSite: config.production ? "none" : "", secure: config.production })
                res.status(400).send({ ok: false, msg: config.errors.regexNotMatch })
            }
        } else {
            res.clearCookie("refreshtoken", { httpOnly: true, path: "/user/refreshAccess", sameSite: config.production ? "none" : "", secure: config.production })
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        res.clearCookie("refreshtoken", { httpOnly: true, path: "/user/refreshAccess", sameSite: config.production ? "none" : "", secure: config.production })
        console.error("\x1b[31m Refreshaccess: ", error, req.body)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = refreshAccess