const security = require('../../shared/security')
const { getUserById } = require("../../shared/database")
const config = require('../../shared/config')

/**
 * @api {post} /user/refresh/getRefresh Get data about your refresh tokens
 * @apiName getRefresh
 * @apiGroup refresh
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


async function getRefresh(req, res) {
    try {
        if (req.cookies.accesstoken && req.cookies.refreshtoken) {
            let refreshtoken = security.jwt.verify(req.cookies.refreshtoken, config.secret)
            let accesstoken = security.jwt.verify(req.cookies.accesstoken, config.secret)
            if (refreshtoken && accesstoken) {
                let user = await getUserById(accesstoken.id)
                if (user) {
                    let tokens = user.token
                    let valid2 = false
                    //Loop backwards to avoid skipping tokens when splicing.
                    for (let i = tokens.length - 1; i > -1; i--) {
                        let x = tokens[i]
                        if (x.token == refreshtoken.token) {
                            valid2 = true
                        }
                        delete x.token
                    }
                    if (valid2) {
                        res.send({ ok: true, tokens: tokens })
                    } else {
                        res.status(401).send({ ok: false, msg: config.errors.invalidToken })
                    }
                } else {
                    res.status(404).send({ok:false, msg: config.errors.accountNotFound})
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
        console.error("\x1b[31m GetRefresh: ", error, req.body)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = getRefresh