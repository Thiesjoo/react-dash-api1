const { updateTokens,getUserById } = require("../../shared/database")
const security = require("../../shared/security")
const config = require("../../shared/config")

async function logout(req, res) {
    try {
        if (req.cookies.accesstoken && req.cookies.refreshtoken && req.body.email) {
            let refreshtoken = security.jwt.verify(req.cookies.refreshtoken, config.secret)
            let accesstoken = security.jwt.verify(req.cookies.accesstoken, config.secret)
            if (accesstoken.email === req.body.email) {
                let user = await getUserById(accesstoken.id)
                if (user) {
                    let userTokens = user.token
                    let tokenExists = userTokens.find(obj => {
                        return obj.token === refreshtoken.token
                    }) !== undefined
                    if (tokenExists) {
                        userTokens = userTokens.filter(object => object.token != refreshtoken.token)
                        updateTokens(accesstoken.id,userTokens)

                        res.clearCookie("accesstoken", { httpOnly: true, path: "/user/", samesite: config.production ? "none" : "", secure: config.production })
                        res.clearCookie("refreshtoken", { httpOnly: true, path: "/user/refreshAccess", samesite: config.production ? "none" : "", secure: config.production })

                        res.send({ ok: true })
                    } else {
                        res.status(401).send({ ok: false, msg: config.errors.noPerms })
                    }
                } else {
                     res.status(404).send({ ok: false, msg: config.errors.accountNotFound })
                }
            } else {
                res.status(401).send({ ok: false, msg: config.errors.noPerms })
            }
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.error("\x1b[31m Logout: ", error, req.body)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = logout