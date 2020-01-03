const { updateOrder } = require("../../../shared/database")
const config = require('../../../shared/config')

async function updateOrderFunc(req, res) {
    try {
        if (req.body.newOrder
            && typeof req.body.newOrder === "object"
            && req.body.type
            && typeof req.body.type === "string"
            && req.body.list
            && typeof req.body.list === "string") {
            let result = await updateOrder(req.body.newOrder, req.body.list, req.body.type, req.decoded.id)
            res.send({ ok: true, result: result })
        } else {
            console.log(req.body,)
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.error("\x1b[31mchangeTask: ", error, req.body)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = updateOrderFunc