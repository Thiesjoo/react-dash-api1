const { deleteCat } = require("../../../shared/database")
const config = require('../../../shared/config')

async function deleteStuffFunc(req, res) {
    try {
        if ( req.body.type
            && typeof req.body.type === "string"
            && req.body.list
            && typeof req.body.list === "string") {
            var result = await deleteCat(req.decoded.email, req.body.list, req.body.type)
            if (result) {
                res.send({ ok: true, tasks: result })
            } else {
                res.send({ ok: false, msg: config.errors.notFound })
            }
        } else {
            res.send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.log("delCat: ", error)
        res.send({ ok: false, msg: config.errors.general })
    }
}

module.exports = deleteStuffFunc