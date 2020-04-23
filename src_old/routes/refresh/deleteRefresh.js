const security = require('../../shared/security')
const { updateTokens, getUserById } = require("../../shared/database")
const config = require('../../shared/config')

/**
 * @api {post} /user/refresh/deleteRefresh Revoke one or more refresh tokens
 * @apiName deleteRefresh
 * @apiGroup refresh
 * @apiHeader {String} Cookie:accesstoken Users unique access-token.
 * @apiHeader {String} Cookie:refreshtoken Users unique refresh-token.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "ok": true,
 *       "tokens": (User's tokens)
 *     }
 *
 * @apiUse UserNotFoundError
 * @apiUse NotEnoughInfoError
 * @apiUse InvalidToken
 * 
 * @apiUse SomethingWentWrongError
 */

async function deleteRefresh(req, res) {
    try {
        if (req.cookies.accesstoken && req.cookies.refreshtoken && req.body.todelete) {
            let refreshtoken = security.jwt.verify(req.cookies.refreshtoken, config.secret)
            let accesstoken = security.jwt.verify(req.cookies.accesstoken, config.secret)
            if (refreshtoken && accesstoken) {
                let user = await getUserById(accesstoken.id)
                if (user) {
                    let tokens = user.token
                    let valid2 = false
                    let filtered = tokens.filter(function (value, index) {
                        if (value.token == refreshtoken.token) {
                            valid2 = true
                            return true
                        }
                        return !req.body.todelete.includes(index)
                    });
                    if (valid2) {
                        updateTokens(accesstoken.id, filtered)
                        res.send({ ok: true, tokens: filtered })
                    } else {
                        res.status(401).send({ ok: false, msg: config.errors.invalidToken })
                    }
                }
            } else {
                res.status(401).send({ ok: false, msg: config.errors.invalidToken })
            }
        } else {
            res.json({
                ok: false,
                message: config.errors.notEnoughInfo
            });
        }
    } catch (error) {
        console.error("\x1b[31m DeleteRefresh: ", error, req.body)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = deleteRefresh