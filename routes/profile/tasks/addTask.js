const { addTask } = require("../../../shared/database")
const config = require('../../../shared/config')

async function addTaskFunc(req, res) {
    try {
        if (req.body.task && typeof req.body.task === "object") {
            console.log("Adding task")
            var task = req.body.task

            if (task.id && "message" in task && task.title && task.priority) {
                var result = await addTask(req.decoded.email, req.body.task)
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
        console.log("addTask: ", error)
        res.send({ ok: false, msg: config.errors.general })
    }
}

module.exports = addTaskFunc