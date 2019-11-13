const { getStuff } = require("../../../shared/database")
const config = require('../../../shared/config')

async function getStuffFunc(req, res) {
    try {
        if (req.body.type) {
            var result = await getStuff(req.decoded.email, req.body.type)
            if (result) {
                res.send({ ok: true, result: result })
            } else {
                res.status(400).send({ ok: false, msg: config.errors.notFound })
            }
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.log("getStuff: ", error)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = getStuffFunc