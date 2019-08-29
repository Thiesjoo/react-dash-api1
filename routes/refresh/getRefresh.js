const security = require('../../shared/security')
const { getUser } = require("../../shared/database")
const config = require('../../shared/config')

async function getRefresh(req, res) {
    try {
        if (req.cookies.accesstoken && req.cookies.refreshtoken) {
            console.log("cookies exist")
            var refreshtoken = security.jwt.verify(req.cookies.refreshtoken, config.secret)
            var accesstoken = security.jwt.verify(req.cookies.accesstoken, config.secret)
            if (refreshtoken && accesstoken) {
                var user = await getUser(accesstoken.email)
                if (user) {
                    console.log("Getting refresh tokens for: ",user)
                    var tokens = JSON.parse(user.token)
                    tokens.forEach(x => {
                        delete x.token
                    })
                    res.send({ ok: true, tokens: tokens })
                }
            } else {
                res.status(401).send({ ok: false, error: config.errors.invalidToken })
            }
        } else {
            res.json({
                ok: false,
                message: config.errors.notEnoughInfo
            });
        }
    } catch (error) {
        console.log("GetRefresh: ", error)
        res.send({ ok: false, msg: config.errors.general })
    }
}

module.exports = getRefresh