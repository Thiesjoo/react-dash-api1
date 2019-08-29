const { deleteTask } = require("../../../shared/database")
const config = require('../../../shared/config')

async function deleteTaskFunc(req, res) {
    try {
        console.log(typeof req.body.id)
        if (req.body.id && typeof req.body.id === "number") {
            console.log("Deleting task", )
            var result = await deleteTask(req.decoded.email, req.body.id)
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

module.exports = deleteTaskFunc