const {getUser} = require("../../shared/database")
const config = require('../../shared/config')

async function profile(req, res) {
    console.log("Profile post")
    if (req.body.email === req.decoded.email) {
        var result = await getUser(req.decoded.email)
            if (result) {
                res.send({ ok: true, data: result.data })
            } else {
                res.send({ ok: false, msg: config.errors.notFound })
            }
    } else {
        res.send({ ok: false, error: config.errors.general })
    }
}

module.exports = profile