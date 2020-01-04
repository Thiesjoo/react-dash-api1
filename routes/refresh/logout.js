const { updateTokens,getUserByEmail } = require("../../shared/database")
const security = require("../../shared/security")
const config = require("../../shared/config")

async function logout(req, res) {
    try {
        if (req.cookies.accesstoken && req.cookies.refreshtoken && req.body.email) {
            let refreshtoken = security.jwt.verify(req.cookies.refreshtoken, config.secret)
            let accesstoken = security.jwt.verify(req.cookies.accesstoken, config.secret)
            if (accesstoken.email === req.body.email) {
                let user = await getUserByEmail(accesstoken.email)
                if (user) {
                    let userTokens = user.token
                    let tokenExists = userTokens.find(obj => {
                        return obj.token === refreshtoken.token
                    }) !== undefined
                    if (tokenExists) {
                        userTokens = userTokens.filter(object => object.token != refreshtoken.token)
                        updateTokens(user._id,userTokens)

                        res.clearCookie("accesstoken", { httpOnly: true, path: "/user/", sameSite: "none", secure: true })
                        res.clearCookie("refreshtoken", { httpOnly: true, path: "/user/refreshAccess", sameSite: "none", secure: true })

                        res.send({ ok: true })
                    } else {
                        res.status(401).send({ ok: false, msg: config.errors.noPerms })
                    }
                } else {
                    res.status(400).send({ ok: false, msg: config.errors.notFound })
                }
            } else {
                res.status(401).send({ ok: false, msg: config.errors.noPerms })
            }
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.error("\x1b[31mLogout: ", error, req.body)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = logout