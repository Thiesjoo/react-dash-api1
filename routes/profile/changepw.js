const { simpleQuery2, getUser } = require("../../shared/database")
const config = require("../../shared/config")
const security = require("../../shared/security")

async function changepw(req, res) {
    try {
        var body = req.body
        if (body.current && body.new) {
            if (security.passwordRegex.test(body.current) && security.passwordRegex.test(body.new)) {
                var user = await getUser(req.decoded.email)
                if (user) {
                    var result2 = await security.bcrypt.compare(body.current, user.password)
                    if (result2) {
                        var newHash = await security.bcrypt.hash(body.new, security.saltRounds)
                        var realtoken = security.randomstring.generate(config.tokenLength)
                        let refreshtoken = security.jwt.sign({ refreshtoken: realtoken }, config.secret, { expiresIn: config.accessExpiry });
                        var refreshArray = [refreshtoken]
                        if (process.env.NODE_ENV !== "production") {
                            res.cookie("refreshtoken", refreshtoken, { expires: new Date(Date.now() + config.refreshExpiry), httpOnly: true, path: "/user/refresh", overwrite: true })
                        } else {
                            res.cookie("refreshtoken", refreshtoken, { expires: new Date(Date.now() + config.refreshExpiry), httpOnly: true, path: "/api1/user/refresh", secure: true, overwrite: true })
                        }
                        var query = "UPDATE users SET password = '" + newHash + "', token = '" + JSON.stringify(refreshArray) + "' WHERE email = '" + req.decoded.email + "'"
                        await simpleQuery2(query)
                        console.log("Updated password for: ", req.decoded.email)
                        res.send({ ok: true })
                    } else {
                        res.send({ ok: false, error: config.errors.wrongPassword })
                    }
                } else {
                    res.send({ ok: false, error: config.errors.notFound })
                }
            } else {
                res.send({ ok: false, error: config.errors.regexNotMatch })
            }
        } else {
            res.send({ ok: false, error: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.log("Changepw: ", error, body)
        res.send({ ok: false, msg: config.errors.general })
    }
}

module.exports = changepw