const { getUser, simpleQuery } = require("../../shared/database")
const security = require("../../shared/security")
const config = require("../../shared/config")

async function logout(req, res) {
    try {
        if (req.cookies.accesstoken && req.cookies.refreshtoken) {
            let refreshtoken = security.jwt.verify(req.cookies.refreshtoken, config.secret)
            let accesstoken = security.jwt.verify(req.cookies.accesstoken, config.secret)
            if (accesstoken.id === req.body.id) {
                let user = await getUser(accesstoken.email)
                if (user) {
                    let userTokens = JSON.parse(user.token)
                    let tokenExists = userTokens.find(obj => {
                        return obj.token === refreshtoken.token
                    }) !== undefined
                    if (tokenExists) {
                        userTokens = userTokens.filter(object => object.token != refreshtoken.token)
                        let query = "UPDATE users SET token = '" + JSON.stringify(userTokens) + "' WHERE email = '" + accesstoken.email + "'"
                        await simpleQuery(query)

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