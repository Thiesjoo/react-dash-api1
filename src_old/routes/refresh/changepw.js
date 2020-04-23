const { getUserById, changePassword } = require("../../shared/database")
const config = require("../../shared/config")
const security = require("../../shared/security")

/**
 * @api {post} /user/refresh/changePW Change password for a user
 * @apiName changePW
 * @apiGroup refresh
 * @apiHeader {String} Cookie:accesstoken Users unique access-token.
 * @apiHeader {String} Cookie:refreshtoken Users unique refresh-token.
 *
 * @apiParam {String} password Users password.
 * @apiParam {String} newPassword Users password.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "ok": true,
 *     }
 *
 * @apiUse UserNotFoundError
 * @apiUse RegexNotMatchError
 * @apiUse NotEnoughInfoError
 * @apiUse InvalidToken
 * @apiUse NoRefresh
 * @apiUse WrongPasswordError
 * 
 * @apiUse SomethingWentWrongError
 */


async function changePasswordFunc(req, res) {
    try {
        let body = req.body
        if (body.currentPassword && body.newPassword) {
            if (req.cookies.accesstoken && req.cookies.refreshtoken) {
                if (security.passwordRegex.test(body.currentPassword) && security.passwordRegex.test(body.newPassword)) {
                    let refreshtoken = security.jwt.verify(req.cookies.refreshtoken, config.secret)
                    let accesstoken = security.jwt.verify(req.cookies.accesstoken, config.secret)
                    if (accesstoken && refreshtoken) {
                        let user = await getUserById(accesstoken.id)
                        if (user) {
                            let currentPasswordResult = await security.bcrypt.compare(body.currentPassword, user.password)
                            if (currentPasswordResult) {
                                let newHash = await security.bcrypt.hash(body.newPassword, security.saltRounds)

                                let result = await changePassword(newHash, accesstoken.id)
                                if (result.result.ok !== 1) throw config.errors.general
                                res.send({ ok: true, msg: "Succesfully updated password" })
                            } else {
                                res.status(400).send({ ok: false, msg: config.errors.wrongPassword })
                            }
                        } else {
                            res.status(404).send({ ok: false, msg: config.errors.accountNotFound })
                        }
                    } else {
                        res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
                    }
                } else {
                    res.status(400).send({ ok: false, msg: config.errors.regexNotMatch })
                }
            } else {
                res.status(401).send({ ok: false, msg: config.errors.noRefresh })
            }
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.error("\x1b[31m Changepw: ", error)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = changePasswordFunc