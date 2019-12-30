const { addItem } = require("../../../shared/database")
const config = require('../../../shared/config')

async function addItemFunc(req, res) {
    try {
        if (req.body.item
            && typeof req.body.item === "object"
            && req.body.list
            && typeof req.body.list === "string"
            && req.body.type
            && typeof req.body.type === "string") {

            let result = await addStuff(req.body.item, req.body.list, req.body.type, req.decoded.email)
            if (result) {
                res.send({ ok: true, result: result })
            } else {
                res.status(400).send({ ok: false, msg: config.errors.notFound })
            }
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.error("\x1b[31maddStuff: ", error)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = addItemFunc