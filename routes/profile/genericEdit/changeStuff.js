const { changeStuff } = require("../../../shared/database")
const config = require('../../../shared/config')

async function changeStuffFunc(req, res) {
    try {
        if (req.body.tochange
            && typeof req.body.tochange === "object"
            && req.body.type
            && typeof req.body.type === "string"
            && req.body.list
            && typeof req.body.list === "string"
            && req.body.id
            && typeof req.body.id === "number") {
            var result = await changeStuff(req.decoded.email, req.body.tochange,req.body.type, req.body.list, req.body.id)
            if (result) {
                res.send({ ok: true, tasks: result })
            } else {
                res.status(400).send({ ok: false, msg: config.errors.notFound })
            }
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.log("changeTask: ", error)
        res.status(400).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = changeStuffFunc