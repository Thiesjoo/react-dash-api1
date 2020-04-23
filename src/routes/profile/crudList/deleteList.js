const { deleteList } = require("../../../shared/database")
const config = require('../../../shared/config')

/**
 * @api {delete} /user/profile/items Delete a list
 * @apiDescription All errors are returned with http code 500, due to a limitation with the database. GET requests use PARAMS and the rest uses the request BODY
 * @apiName deleteList
 * @apiGroup CRUD 
 * @apiHeader {String} Cookie:accesstoken Users unique access-token.

 *
 * @apiParam {String} list The list to delete
 * @apiParam {String} type Category of the item(tasks, banking and notifications)
 *
 * @apiSuccess {Object} data All the data from the user.
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

async function deleteListFunc(req, res) {
    try {
        if (req.body.list
            && typeof req.body.list === "string"
            && req.body.type
            && typeof req.body.type === "string") {
                
            let result = await deleteList(req.body.list, req.body.type, req.decoded.id)
            res.send({ ok: true, result: result })
        } else {
            console.warn(req.body)
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.error("\x1b[31m addItem:", error, req.body)
        res.status(500).send({ ok: false, msg: error })
    }
}

module.exports = deleteListFunc