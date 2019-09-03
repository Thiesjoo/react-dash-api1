const { deleteStuff } = require("../../../shared/database")
const config = require('../../../shared/config')

async function deleteStuffFunc(req, res) {
    try {
        if (req.body.id
            && typeof req.body.id === "number"
            && req.body.type
            && typeof req.body.type === "string"
            && req.body.list
            && typeof req.body.list === "string") {
            var result = await deleteStuff(req.decoded.email, req.body.list, req.body.type, req.body.id)
            if (result) {
                res.send({ ok: true, tasks: result })
            } else {
                res.send({ ok: false, msg: config.errors.notFound })
            }
        } else {
            res.send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.log("delTask: ", error)
        res.send({ ok: false, msg: config.errors.general })
    }
}

module.exports = deleteStuffFunc