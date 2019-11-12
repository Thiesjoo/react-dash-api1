const { getUser } = require("../../shared/database")
const config = require('../../shared/config')

async function profile(req, res) {
    try {
        if (req.body.email === req.decoded.email) {
            var result = await getUser(req.decoded.email)
            if (result) {
                res.send({ ok: true, data: result.data })
            } else {
                res.status(400).send({ ok: false, msg: config.errors.accountNotFound })
            }
        } else {
            res.status(400).send({ ok: false, error: config.errors.general })
        }
    } catch (error) {
        console.log("Profile: ", error)
        res.status(400).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = profile