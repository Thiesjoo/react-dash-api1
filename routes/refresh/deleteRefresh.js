const security = require('../../shared/security')
const { simpleQuery, getUser } = require("../../shared/database")
const config = require('../../shared/config')

async function deleteRefresh(req, res) {
    try {
        if (req.cookies.accesstoken && req.cookies.refreshtoken && req.body.todelete) {
            console.log("cookies exist")
            let refreshtoken = security.jwt.verify(req.cookies.refreshtoken, config.secret)
            let accesstoken = security.jwt.verify(req.cookies.accesstoken, config.secret)
            if (refreshtoken && accesstoken) {
                let user = await getUser(accesstoken.email)
                if (user) {
                    let tokens = JSON.parse(user.token)
                    let valid2 = false
                    let filtered = tokens.filter(function (value, index) {
                        if (value.token == refreshtoken.token) {
                            valid2 = true
                        }
                        return !req.body.todelete.includes(index)
                    });
                    if (valid2) {
                        console.log(tokens.length, filtered.length)
                        await simpleQuery("UPDATE users SET token = '" + JSON.stringify(filtered) + "' WHERE email = ?", [accesstoken.email])
                        res.send({ ok: true, tokens: filtered })
                    } else {
                        res.status(401).send({ ok: false, error: config.errors.invalidToken })
                    }
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
        console.error("\x1b[31mDeleteRefresh: ", error, req.body)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = deleteRefresh