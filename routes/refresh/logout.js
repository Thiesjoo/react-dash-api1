const { getUser, simpleQuery } = require("../../shared/database")
const security = require("../../shared/security")
const config = require("../../shared/config")

async function logout(req, res) {
    try {
        if (req.cookies.accesstoken && req.cookies.refreshtoken) {
            let refreshtoken = security.jwt.verify(req.cookies.refreshtoken, config.secret)
            let accesstoken = security.jwt.verify(req.cookies.accesstoken, config.secret)
            console.log("Logging out: ", req.body)
            if (accesstoken.id === req.body.id) {
                let user = await getUser(accesstoken.email)
                if (user) {
                    let userTokens = JSON.parse(user.token)
                    let valid = userTokens.find(obj => {
                        return obj.token === refreshtoken.token
                    })
                    if (valid !== undefined) {
                        // console.log("Logout: Getting refresh tokens for: ", refreshtoken)
                        // console.log(userTokens.length)
                        userTokens = userTokens.filter(object => object.token != refreshtoken.token)
                        // console.log(userTokens.length)
                        let query = "UPDATE users SET token = '" + JSON.stringify(userTokens) + "' WHERE email = '" + accesstoken.email + "'"
                        await simpleQuery(query)
                        if (!config.production) {
                            console.log("Dev cookies")
                            res.clearCookie("accesstoken", { httpOnly: true, path: "/user/" })
                            res.clearCookie("refreshtoken", { httpOnly: true, path: "/user/refreshAccess" })
                        } else {
                            res.clearCookie("accesstoken", { httpOnly: true, path: "/api1/user/", secure: true })
                            res.clearCookie("refreshtoken", { httpOnly: true, path: "/api1/user/refreshAccess", secure: true })
                        }
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
        console.log("Logout: ", error)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = logout