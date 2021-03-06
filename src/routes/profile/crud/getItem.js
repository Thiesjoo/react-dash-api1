const { getItem, getUserById } = require("../../../shared/database")
const config = require('../../../shared/config')

/**
 * @api {get} /user/profile/item Get item
 * @apiDescription All errors are returned with http code 500, due to a limitation with the database. GET requests use PARAMS and the rest uses the request BODY
 * @apiName getItem
 * @apiGroup CRUD 
 * @apiHeader {String} Cookie:accesstoken Users unique access-token.

 *
 * @apiParam {String} list *Optional* When not specified gather all data from specified type else: The list of items
 * @apiParam {String} type *Optional* When not specified gather all data else: Category of the item(tasks, banking and notifications)
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

async function getItemFunc(req, res) {
    try {
        let result = undefined
        if (req.query.type && config.allowedTypes.includes(req.query.type) &&
            req.query.list) {
            // Get specific list from type
            result = await getItem(req.query.id, req.query.list, req.query.type, req.decoded.id)
        } else if (req.query.type && config.allowedTypes.includes(req.query.type)) {
            // Get everything from type
            result = await getItem(undefined, undefined, req.query.type, req.decoded.id)
        } else {
            user = await getUserById(req.decoded.id)
            if (user) {
                result = user.data
            } 
        }
        if (result) {
            res.send({ ok: true, result: result })
        } else {
            res.status(400).send({ ok: false, result: config.errors.notFound })
        }

    } catch (error) {
        console.error("\x1b[31m getItem:", error, req.body)
        res.status(500).send({ ok: false, msg: error })
    }
}

module.exports = getItemFunc