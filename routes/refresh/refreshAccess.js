const security = require('../../shared/security')
const { getUserByEmail } = require("../../shared/database")
const config = require('../../shared/config')

async function refreshAccess(req, res) {
    try {
        let body = req.body
        console.log("Valid cookie in function refresh token: ", req.cookies.refreshtoken ? "yes" : "no")
        if (body.email && req.cookies.refreshtoken) {
            //First check if user exists
            if (security.emailRegex.test(body.email)) {
                let user = await getUserByEmail(body.email)
                if (user) {
                    console.log("Refreshing access for: ", user.id)
                    let refreshtoken = security.jwt.verify(req.cookies.refreshtoken, config.secret)
                    console.log("With tokeN: ", refreshtoken)
                    if (refreshtoken) {
                        let refreshArray = user.token
                        // console.log(refreshArray)
                        let newresult = refreshArray.find(x => x.token === refreshtoken.token);
                        // console.log(newresult)
                        if (newresult) {
                            console.log("Cookie verified")
                            let accesstoken = security.jwt.sign({ email: body.email, id: user._id },
                                config.secret,
                                {
                                    expiresIn: config.accessExpiry
                                }
                            );
                            res.cookie("accesstoken", accesstoken, { expires: new Date(Date.now() + config.accessExpiry), httpOnly: true, secure: true, sameSite: "none", path: "/user/" })
                            res.send({ ok: true })
                        } else {
                            res.clearCookie("refreshtoken", { httpOnly: true, path: "/user/refreshAccess", sameSite: "none", secure: true })
                            console.log("Token is invalid")
                            res.status(401).send({ ok: false, msg: config.errors.noPerms })
                        }
                    } else {
                        res.clearCookie("refreshtoken", { httpOnly: true, path: "/user/refreshAccess", sameSite: "none", secure: true })
                        return res.json({
                            ok: false,
                            message: config.errors.invalidToken
                        });
                    }
                } else {
                    res.clearCookie("refreshtoken", { httpOnly: true, path: "/user/refreshAccess", sameSite: "none", secure: true })
                    res.status(400).send({ ok: false, msg: config.errors.accountNotFound })
                }
            } else {
                res.clearCookie("refreshtoken", { httpOnly: true, path: "/user/refreshAccess", sameSite: "none", secure: true })
                res.status(400).send({ ok: false, msg: config.errors.regexNotMatch })
            }
        } else {
            res.clearCookie("refreshtoken", { httpOnly: true, path: "/user/refreshAccess", sameSite: "none", secure: true })
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        res.clearCookie("refreshtoken", { httpOnly: true, path: "/user/refreshAccess", sameSite: "none", secure: true })
        console.error("\x1b[31mRefreshaccess: ", error, req.body)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = refreshAccess