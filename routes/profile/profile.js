const con = require("../../shared/database").con
const config = require('../../shared/config')

function profile(req, res) {
    console.log("Profile post")
    if (req.body.email === req.decoded.email) {
        con.query("SELECT * FROM users WHERE email = ?", [req.decoded.email], function (err, result) {
            if (err) {
                res.status(404).end()
                throw err
            }
            if (result[0]) {
                res.send({ ok: true, data: result.data })
            } else {
                res.send({ ok: false, msg: config.errors.notFound })
            }
        })
    } else {
        res.send({ ok: false, error: config.errors.general })
    }
}

module.exports = profile