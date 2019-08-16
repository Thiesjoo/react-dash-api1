const con = require("../../shared/database").con

function logout(req, res) {
    if (req.decoded.id === req.body.id) {
        con.query("UPDATE users SET token = '[]' WHERE id = ?", [req.decoded.id], function (err, result) {
            if (err) {
                res.status(404).end()
                throw err
            }
            if (process.env.NODE_ENV !== "production") {
                console.log("Dev cookies")
                res.clearCookie("accesstoken", { httpOnly: true, path: "/user/" })
                res.clearCookie("refreshtoken", { httpOnly: true, path: "/user/refreshAccess" })
            } else {
                res.clearCookie("accesstoken", { httpOnly: true, path: "/api1/user/", secure: true })
                res.clearCookie("refreshtoken", { httpOnly: true, path: "/api1/user/refreshAccess", secure: true })
            }
            res.send({ ok: true })
        })
    } else {
        res.send({ ok: false, error: config.errors.general })
    }
}

module.exports = logout