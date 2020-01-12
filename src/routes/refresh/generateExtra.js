const { jwt, randomstring } = require('../../shared/security')
const { getUserById, updateTokens } = require("../../shared/database")
const config = require('../../shared/config')

async function generateExtraToken(req, res) {
    try {
        if (req.cookies.accesstoken && req.cookies.refreshtoken) {
            console.log("Gcookies exist")
            let refreshtoken = jwt.verify(req.cookies.refreshtoken, config.secret)
            let accesstoken = jwt.verify(req.cookies.accesstoken, config.secret)
            if (refreshtoken && accesstoken) {
                let user = await getUserById(accesstoken.id)
                if (user) {
                    let userTokens = user.token
                    console.log("Getting refresh tokens for: ", accesstoken)
                    let valid = true
                    let valid2 = false
                    userTokens.forEach(element => {
                        if (element.platform == "mobile") {
                            if (new Date() - new Date(element.expiry) < 3600000) {
                                console.log("Being rate limited by: ", element)
                                valid = false
                            }
                        }
                        if (element.token == refreshtoken.token) {
                            valid2 = true
                        }
                    });
                    if (valid2) {
                        if (valid || !config.production) {
                            const expiryTime = config.refreshExpiry * 5
                            let realtoken = randomstring.generate(5)
                            let newRefreshtoken = jwt.sign({ token: realtoken, extra: true, id: accesstoken.id }, config.secret, { expiresIn: expiryTime });
                            let refreshArray = userTokens
                            refreshArray.push({ token: realtoken, platform: "Extra Token", useragent: "To be used in API's or on mobile phones", expiry: new Date(Date.now() + expiryTime) })

                            await updateTokens(accesstoken.id, refreshArray)
                            res.send({ ok: true, msg: "", token: newRefreshtoken })
                        } else {
                            res.status(400).send({ ok: false, msg: config.errors.rateLimit })
                        }
                    } else {
                        res.status(401).send({ ok: false, msg: config.errors.invalidToken })
                    }
                }
            } else {
                res.status(401).send({ ok: false, msg: config.errors.invalidToken })
            }
        } else {
            res.json({
                ok: false,
                message: config.errors.notEnoughInfo
            });
        }
    } catch (error) {
        console.error("\x1b[31m generateMobile: ", error, req.body)
        res.status(500).send({ ok: false, msg: error })
    }
}

module.exports = generateExtraToken