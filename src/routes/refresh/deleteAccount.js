const { getUserById, deleteAccount } = require("../../shared/database")
const config = require("../../shared/config")
const security = require("../../shared/security")

/**
 * @api {post} /user/refresh/deleteAccount Delete a user's account
 * @apiName deleteAccount
 * @apiGroup refresh
 * @apiHeader {String} Cookie:accesstoken Users unique access-token.
 * @apiHeader {String} Cookie:refreshtoken Users unique refresh-token.
 * 
 * @apiParam {String} password Users password.
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

async function deleteAccountFunction(req, res) {
    try {
        let body = req.body
        if (body.password) {
            if (security.passwordRegex.test(body.password)) {
                let refreshtoken = security.jwt.verify(req.cookies.refreshtoken, config.secret)
                let accesstoken = security.jwt.verify(req.cookies.accesstoken, config.secret)

                if (accesstoken && refreshtoken) {
                    let user = await getUserById(accesstoken.id)
                    if (user) {
                        let passwordResult = await security.bcrypt.compare(body.password, user.password)
                        if (passwordResult) {
                            let databaseResult = await deleteAccount(accesstoken.id, accesstoken.email)
                            let result = databaseResult.result
                            if (result.ok === 1) {
                                res.send({ ok: true })
                            } else {
                                throw config.errors.general
                            }
                        } else {
                            res.status(401).send({ ok: false, msg: config.errors.wrongPassword })
                        }
                    } else {
                         res.status(404).send({ ok: false, msg: config.errors.accountNotFound })
                    }
                } else {
                    res.status(401).send({ ok: false, msg: config.errors.noRefresh })
                }
            } else {
                res.status(400).send({ ok: false, msg: config.errors.regexNotMatch })
            }
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.error("\x1b[31m deleteAccount: ", error, req.body)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = deleteAccountFunction