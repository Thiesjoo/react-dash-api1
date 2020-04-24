const { addItem } = require("../../../../helpers/dbFunctions")
const config = require('typedi').Container.get("config")

/**
 * @api {post} /user/profile/item Add item
 * @apiDescription All errors are returned with http code 500, due to a limitation with the database. GET requests use PARAMS and the rest uses the request BODY
 * @apiName addItem
 * @apiGroup CRUD 
 * @apiHeader {String} Cookie:accesstoken Users unique access-token.

 *
 * @apiParam {Object} item Item to add. Has to comply with config of type
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
 * @apiUse InvalidInfoError
 * @apiUse NotEnoughPermissions
 * @apiUse NotEnoughInfoError
 * 
 * @apiUse SomethingWentWrongError
 */

async function addItemFunc(req, res, next) {
    try {
        if (req.body.item
            && typeof req.body.item === "object"
            && req.body.list
            && typeof req.body.list === "string"
            && req.body.type
            && typeof req.body.type === "string") {
                
            let result = await addItem(req.body.item, req.body.list, req.body.type, req.body.index, req.decoded.id)
            res.send({ ok: true, result: result })
        } else {
            throw new Error(config.errors.notEnoughInfo)
        }
    } catch (error) {
        next(error)
    }
}

module.exports = addItemFunc