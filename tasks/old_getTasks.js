const { getTasks } = require("../../../shared/database")
const config = require('../../../shared/config')

async function getTasksFunc(req, res) {
    try {
        var result = await getTasks(req.decoded.email)
        if (result) {
            res.send({ ok: true, tasks: result })
        } else {
            res.send({ ok: false, msg: config.errors.notFound })
        }
    } catch (error) {
        console.log("getTasks: ", error)
        res.send({ ok: false, msg: config.errors.general })
    }
}

module.exports = getTasksFunc