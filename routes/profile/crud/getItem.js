const { getItem, getUserMongo } = require("../../../shared/database")
const config = require('../../../shared/config')

async function getItemFunc(req, res) {
    try {
        let result = undefined
        if (req.query.type && config.allowedTypes.includes(req.query.type) &&
        req.query.list){
            // Get specific list from type
            result = await getItem(req.query.id, req.query.list,req.query.type, req.decoded.email)
        } else if (req.query.type && config.allowedTypes.includes(req.query.type)) {
            // Get everything from type
            result = await getItem(undefined, undefined,req.query.type, req.decoded.email)
        } else {
            result = await getUserMongo(req.decoded.email)
            result = result.data
        }
        if (result) {
            console.log(result)
            res.send({ ok: true, result: result })
        } else {
            res.status(400).send({ ok: false, result: config.errors.notFound })
        }

    } catch (error) {
        console.error("\x1b[31mgetItem: ", error, req.body)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = getItemFunc