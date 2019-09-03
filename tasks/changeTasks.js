const { changeTasks } = require("../../../shared/database")
const config = require('../../../shared/config')

async function changeTasksFunc(req, res) {
    try {
        if (req.body.tasks && typeof req.body.tasks === "object", req.body.list) {
            console.log("Changing tasks", req.body)
            var tasks = req.body.tasks
            var valid = true
            tasks.forEach(x => {
                if (x.id < 0 || !x.title || !"message" in x || !x.priority) {
                    valid = false
                }
            });
            if (valid) {
                var result = await changeTasks(req.decoded.email, req.body.tasks, req.body.list)
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
        console.log("changeTasks: ", error)
        res.send({ ok: false, msg: config.errors.general })
    }
}

module.exports = changeTasksFunc