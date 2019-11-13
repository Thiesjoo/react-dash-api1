const { deleteCat } = require("../../../shared/database")
const config = require('../../../shared/config')

async function deleteCatFunc(req, res) {
    try {
        if (req.body.type
            && typeof req.body.type === "string"
            && req.body.list
            && typeof req.body.list === "string") {
            let result = await deleteCat(req.decoded.email, req.body.list, req.body.type)
            if (result) {
                res.send({ ok: true, tasks: result })
            } else {
                res.status(400).send({ ok: false, msg: config.errors.notFound })
            }
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.log("delTask: ", error)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = deleteCatFunc