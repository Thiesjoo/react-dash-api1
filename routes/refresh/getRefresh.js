const security = require('../../shared/security')
const { getUser } = require("../../shared/database")
const config = require('../../shared/config')

async function getRefresh(req, res) {
    try {
        if (req.cookies.accesstoken && req.cookies.refreshtoken) {
            console.log("cookies exist")
            let refreshtoken = security.jwt.verify(req.cookies.refreshtoken, config.secret)
            let accesstoken = security.jwt.verify(req.cookies.accesstoken, config.secret)
            if (refreshtoken && accesstoken) {
                let user = await getUser(accesstoken.email)
                if (user) {
                    // console.log("Getting refresh tokens for: ", user)
                    let tokens = JSON.parse(user.token)
                    let valid2 = false
                    for (let i = tokens.length - 1; i > -1; i--) {
                        let x = tokens[i]
                        // console.log(x.token, refreshtoken.token)
                        if (x.token == refreshtoken.token) {
                            // console.log("This is your own token, so you cant delete it, Also not showing")
                            tokens.splice(i, 1)
                            valid2 = true
                        }
                        if (x.platform) {
                            if (x.platform == "mobile") {
                            } else {
                                delete x.token
                            }
                        } else {
                            delete x.token
                        }

                    }
                    if (valid2) {
                        res.send({ ok: true, tokens: tokens })
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
        console.log("GetRefresh: ", error)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = getRefresh