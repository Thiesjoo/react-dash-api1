const { deleteItem } = require("../../../shared/database")
const config = require('../../../shared/config')

async function deleteItemFunc(req, res) {
    try {
        console.log(req.decoded)
        if (req.body.id
            && typeof req.body.id === "string"
            && req.body.list
            && typeof req.body.list === "string"
            && req.body.type
            && typeof req.body.type === "string") {

            let result = await deleteItem(req.body.id, req.body.list, req.body.type, req.decoded.id)
            res.send({ ok: true, result: result })
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.error("\x1b[31mdelCat: ", error, req.body)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = deleteItemFunc