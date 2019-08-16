const security = require('../../shared/security')
const con = require("../../shared/database").con
const config = require('../../shared/config')

function refreshAccess(req, res) {
    var body = req.body
    console.log("Valid cookie in function refresh token: ", req.cookies.refreshtoken ? "yes" : "no")
    if (body.email && req.cookies.refreshtoken) {
        //First check if user exists
        if (security.emailRegex.test(body.email)) {
            con.query("SELECT * FROM users WHERE email = ?", [body.email], function (err, result) {
                if (err) {
                    res.status(404).end()
                    throw err
                }
                if (result[0]) {
                    console.log("Refreshing access for: ", result[0].id)
                    security.jwt.verify(req.cookies.refreshtoken, config.secret, (err, decoded) => {
                        if (err) {
                            return res.json({
                                ok: false,
                                message: config.errors.invalidToken
                            });
                        } else {
                            var refreshArray = JSON.parse(result[0].token)
                            var newresult = refreshArray.find( x => x.token === decoded.refreshtoken );
                            console.log(refreshArray, decoded.refreshtoken, newresult)
                            if (newresult) {
                                console.log("Cookie verified")
                                let accesstoken = security.jwt.sign({ email: body.email, id: result[0].id },
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
                    res.send({ ok: false, msg: config.errors.notFound })
                }
            })
        } else {
            res.send({ ok: false, msg: config.errors.regexNotMatch })
        }
    } else {
        res.send({ ok: false, msg: config.errors.notEnoughInfo })
    }
}

module.exports = refreshAccess