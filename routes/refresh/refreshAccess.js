const security = require('../../shared/security')
const { getUser } = require("../../shared/database")
const config = require('../../shared/config')

async function refreshAccess(req, res) {
    try {
        var body = req.body
        console.log("Valid cookie in function refresh token: ", req.cookies.refreshtoken ? "yes" : "no")
        if (body.email && req.cookies.refreshtoken) {
            //First check if user exists
            if (security.emailRegex.test(body.email)) {
                var result = await getUser(body.email)
                if (result) {
                    console.log("Refreshing access for: ", result.id)
                    security.jwt.verify(req.cookies.refreshtoken, config.secret, (err, decoded) => {
                        if (err) {
                            return res.json({
                                ok: false,
                                message: config.errors.invalidToken
                            });
                        } else {
                            var refreshArray = JSON.parse(result.token)
                            var newresult = refreshArray.find(x => x.token === decoded.refreshtoken);
                            // console.log(refreshArray, decoded.refreshtoken, newresult)
                            if (newresult) {
                                console.log("Cookie verified")
                                let accesstoken = security.jwt.sign({ email: body.email, id: result.id },
                                    config.secret,
                                    {
                                        expiresIn: config.accessExpiry
                                    }
                                );
                                res.cookie("accesstoken", accesstoken, { expires: new Date(Date.now() + config.accessExpiry), httpOnly: true, path: "/user/" })
                                res.send({ ok: true })
                            } else {
                                res.send({ ok: false, msg: config.errors.noRefresh })
                            }
                        }
                    });
                } else {
                    res.send({ ok: false, msg: config.errors.accountNotFound })
                }

            } else {
                res.send({ ok: false, msg: config.errors.regexNotMatch })
            }
        } else {
            res.send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch(error){
        console.log("Refreshaccess: ", error, req.body)
        res.send({ ok: false, msg: config.errors.general })
    }
}

module.exports = refreshAccess