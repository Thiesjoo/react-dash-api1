const { changeStuffs } = require("../../../shared/database")
const config = require('../../../shared/config')

async function changeStuffsFunc(req, res) {
    try {
        if (req.body.tochange
            && typeof req.body.tochange === "object"
            && req.body.type
            && typeof req.body.type === "string"
            && req.body.list
            && typeof req.body.list === "string") {
            var result = await changeStuffs(req.decoded.email, req.body.type, req.body.tochange, req.body.list)
            if (result) {
                res.send({ ok: true, result: result })
            } else {
                res.send({ ok: false, msg: config.errors.notFound })
            }

        } else {
            res.send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.log("changeStuffs: ", error)
        res.send({ ok: false, msg: config.errors.general })
    }
}

module.exports = changeStuffsFunc