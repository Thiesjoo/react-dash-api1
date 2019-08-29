const { getTask } = require("../../../shared/database")
const config = require('../../../shared/config')

async function getTaskFunc(req, res) {
    try {
        if (req.body.id && typeof req.body.id === "number") {
            console.log("Getting task")
            var result = await getTask(req.decoded.email, req.body.id)
            if (result) {
                res.send({ ok: true, tasks: result })
            } else {
                res.send({ ok: false, msg: config.errors.notFound })
            }
        } else {
            res.send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.log("getTask: ", error)
        res.send({ ok: false, msg: config.errors.general })
    }
}

module.exports = getTaskFunc