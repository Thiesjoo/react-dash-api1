const { updateOrder } = require("../../../shared/database")
const config = require('../../../shared/config')

/**
 * @api {patch} /user/profile/items Update order of items
 * @apiDescription All errors are returned with http code 500, due to a limitation with the database. GET requests use PARAMS and the rest uses the request BODY
 * @apiName updateOrder
 * @apiGroup CRUD 
 * @apiHeader {String} Cookie:accesstoken Users unique access-token.

 *
 * @apiParam {Object} item List of the order of items. Format: [{id: (item_id), children: [(item_id)]}]
 * @apiParam {String} list The list to add the item to
 * @apiParam {String} type Category of the item(tasks, banking and notifications)
 *
 * @apiSuccess {Object} data All the data from the requested list(From type).
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "ok": true,
 *       "result": (result)
 *     }
 *
 * @apiUse UserNotFoundError
 * @apiUse WrongPasswordError
 * @apiUse InvalidInfoError
 * @apiUse NotEnoughPermissions
 * @apiUse NotEnoughInfoError
 * 
 * @apiUse SomethingWentWrongError
 */



async function updateOrderFunc(req, res) {
    try {
        if (req.body.newOrder
            && typeof req.body.newOrder === "object"
            && req.body.type
            && typeof req.body.type === "string"
            && req.body.list
            && typeof req.body.list === "string") {
            let result = await updateOrder(req.body.newOrder, req.body.list, req.body.type, req.decoded.id)
            res.send({ ok: true, result: result })
        } else {
            console.warn(req.body)
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.error("\x1b[31m updateOrder: ", error, req.body)
        res.status(500).send({ ok: false, msg: error })
    }
}

module.exports = updateOrderFunc