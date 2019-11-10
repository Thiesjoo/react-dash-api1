const { jwt, randomstring } = require('../../shared/security')
const { getUser, simpleQuery } = require("../../shared/database")
const config = require('../../shared/config')

async function generateMobile(req, res) {
    try {
        if (req.cookies.accesstoken && req.cookies.refreshtoken ) {
            console.log("cookies exist")
            var refreshtoken = jwt.verify(req.cookies.refreshtoken, config.secret)
            var accesstoken = jwt.verify(req.cookies.accesstoken, config.secret)
            if (refreshtoken && accesstoken) {
                var user = await getUser(accesstoken.email)
                if (user) {
                    console.log("Getting refresh tokens for: ",user)
                    var realtoken = randomstring.generate(config.tokenLength)
                    let refreshtoken = jwt.sign({ refreshtoken: realtoken, mobile: true }, config.secret, { expiresIn: config.accessExpiry });
                    var refreshArray = JSON.parse(user.token)
                    refreshArray.push({ token: realtoken, platform: "mobile", expiry: new Date(Date.now() + config.refreshExpiry*2) })
                    var query = "UPDATE users SET token = '" + JSON.stringify(refreshArray) + "' WHERE email = '" + accesstoken.email + "'"
                    await simpleQuery(query)
                    res.send({ ok: true, token: refreshtoken })
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

module.exports = generateMobile