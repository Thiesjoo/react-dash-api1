const { deleteItem } = require("../../../shared/database")
const config = require('../../../shared/config')

/**
 * @api {delete} /user/profile/item Delete item
 * @apiDescription All errors are returned with http code 500, due to a limitation with the database. GET requests use PARAMS and the rest uses the request BODY
 * @apiName deleteItem
 * @apiGroup CRUD 
 * @apiHeader {String} Cookie:accesstoken Users unique access-token.

 *
 * @apiParam {String} id Id of item to delete
 * @apiParam {String} list List of the item
 * @apiParam {String} type Category of the item(tasks, banking and notifications )
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

async function deleteItemFunc(req, res) {
    try {
        if (req.body.id
            && typeof req.body.id === "string"
            && req.body.list
            && typeof req.body.list === "string"
            && req.body.type
            && typeof req.body.type === "string") {

            let result = await deleteItem(req.body.id, req.body.list, req.body.type, req.decoded.id)
            res.send({ ok: true, result: result })
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.error("\x1b[31m deleteItem: ", error, req.body)
        res.status(500).send({ ok: false, msg: error })
    }
}

module.exports = deleteItemFunc