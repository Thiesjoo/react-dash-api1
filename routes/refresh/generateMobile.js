const { jwt, randomstring } = require('../../shared/security')
const { getUser, simpleQuery } = require("../../shared/database")
const config = require('../../shared/config')

async function generateMobile(req, res) {
    try {
        if (req.cookies.accesstoken && req.cookies.refreshtoken) {
            console.log("Gcookies exist")
            var refreshtoken = jwt.verify(req.cookies.refreshtoken, config.secret)
            var accesstoken = jwt.verify(req.cookies.accesstoken, config.secret)
            if (refreshtoken && accesstoken) {
                var user = await getUser(accesstoken.email)
                if (user) {
                    var userTokens = JSON.parse(user.token)
                    console.log("Getting refresh tokens for: ", accesstoken)
                    var valid = true
                    userTokens.forEach(element => {
                        if (element.platform == "mobile") {
                            if (new Date() - new Date(element.expiry) < 3600000) {
                                console.log("Being rate limited by: ", element)
                                valid = false
                            }
                        }
                    });
                    if (valid) {
                        var realtoken = randomstring.generate(5)
                        // let newRefreshtoken = jwt.sign({ a: realtoken, mobile: true, email: accesstoken.email }, config.secret, { expiresIn: config.accessExpiry });
                        var refreshArray = JSON.parse(user.token)
                        refreshArray.push({ token: realtoken, platform: "mobile", expiry: new Date(Date.now() + config.refreshExpiry * 2) })
                        var query = "UPDATE users SET token = '" + JSON.stringify(refreshArray) + "' WHERE email = '" + accesstoken.email + "'"
                        await simpleQuery(query)
                        res.send({ ok: true })
                    } else {
                        res.status(400).send({ ok: false, msg: config.errors.rateLimit })
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
        res.status(400).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = generateMobile