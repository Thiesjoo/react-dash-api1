const { updateItem } = require("../../../shared/database")
const config = require('../../../shared/config')

async function updateItemFunc(req, res) {
    try {
        if (req.body.item
            && typeof req.body.item === "object"
            && req.body.type
            && typeof req.body.type === "string"
            && req.body.list
            && typeof req.body.list === "string"
            && req.body.id
            && typeof req.body.id === "string") {
                console.log("Test")
            let result = await updateItem(req.body.id, req.body.item, req.body.list, req.body.type, req.decoded.id)
            res.send({ ok: true, result: result })
        } else {
            console.log(req.body)
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.error("\x1b[31mchangeTask: ", error, req.body)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = updateItemFunc