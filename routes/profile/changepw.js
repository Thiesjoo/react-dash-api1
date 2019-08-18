const con = require("../../shared/database").con
const simpleQuery = require("../../shared/database").simpleQuery
const config = require("../../shared/config")
const security = require("../../shared/security")

function changepw(req, res) {
    console.log('Changepw', req.body)
    var body = req.body

    if (body.current && body.new) {
        if (security.passwordRegex.test(body.current) && security.passwordRegex.test(body.new)) {
            con.query("SELECT * FROM users WHERE email = ?", [req.decoded.email], function (err, result) {
                if (err) {
                    res.status(404).end()
                    throw err
                }
                if (result[0]) {
                    security.bcrypt.compare(body.current, result[0].password, function (err, result2) {
                        if (err) {
                            res.status(404).end()
                            throw err
                        }
                        if (result) {
                            security.bcrypt.hash(body.new, security.saltRounds, function (err, hash) {
                                if (err) {
                                    res.status(404).end()
                                    throw err
                                }
                                var query = "UPDATE users SET password = '" + hash + "' WHERE email = '" + req.decoded.email + "'"
                                simpleQuery(query)
                                console.log("Updated password for: ", req.decoded.email)
                                res.send({ ok: true })
                            })
                        } else {
                            res.send({ ok: false, error: config.errors.wrongPassword })
                        }
                    })
                    //res.send({ ok: true, data: result.data })
                } else {
                    res.send({ ok: false, error: config.errors.notFound })
                }
            })
        } else {
            res.send({ ok: false, error: config.errors.regexNotMatch })
        }
    } else {
        res.send({ ok: false, error: config.errors.notEnoughInfo })
    }
}

module.exports = changepw