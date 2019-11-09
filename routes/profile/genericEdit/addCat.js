const { addCat } = require("../../../shared/database")
const config = require('../../../shared/config')

async function addCatFunc(req, res) {
    try {
        if (req.body.list
            && typeof req.body.list === "string"
            && req.body.type
            && typeof req.body.type === "string") {
            var result = await addCat(req.decoded.email,req.body.type,req.body.list)
            if (result) {
                res.send({ ok: true, result: result })
            } else {
                res.send({ ok: false, msg: config.errors.notFound })
            }
        } else {
            res.send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.log("addCat: ", error)
        res.send({ ok: false, msg: config.errors.general })
    }
}

module.exports = addCatFunc