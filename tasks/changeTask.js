const { changeTask } = require("../../../shared/database")
const config = require('../../../shared/config')

async function changeTaskFunc(req, res) {
    try {
        if (req.body.task && typeof req.body.task === "object" && req.body.id && typeof req.body.id === "number") {
            var task = req.body.task
            if (task.id &&  "message" in task  && task.priority && task.id) {
                console.log("Changing task")
                var result = await changeTask(req.decoded.email, req.body.task, req.body.id)
                if (result) {
                    res.send({ ok: true, tasks: result })
                } else {
                    res.send({ ok: false, msg: config.errors.notFound })
                }
            } else {
                res.send({ ok: false, msg: config.errors.notEnoughInfo })
            }
        } else {
            res.send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.log("changeTask: ", error)
        res.send({ ok: false, msg: config.errors.general })
    }
}

module.exports = changeTaskFunc