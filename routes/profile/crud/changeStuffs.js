const { changeStuffs } = require("../../../shared/database")
const config = require('../../../shared/config')

async function changeStuffsFunc(req, res) {
    try {
        if (req.body.tochange
            && typeof req.body.tochange === "object"
            && req.body.type
            && typeof req.body.type === "string"
            && req.body.list
            && typeof req.body.list === "string") {
            let result = await changeStuffs(req.decoded.email, req.body.type, req.body.tochange, req.body.list)
            if (result) {
                res.send({ ok: true, result: result })
            } else {
                res.status(400).send({ ok: false, msg: config.errors.notFound })
            }

        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.error("\x1b[31mchangeStuffs: ", error)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = changeStuffsFunc