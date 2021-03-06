const express = require('express')
const routes = express.Router();
const { getMongoDB } = require("../shared/database")
const config = require('../shared/config')
const checkToken = require("../shared/security").checkToken

/**
 * @api {post} /errors/ Add a error to the errorlog
 * @apiName errors
 * @apiGroup Monitoring
 * @apiHeader {String} Cookie:accesstoken Users unique access-token.
 *
 * @apiParam {Array} errors Array with seperate error objects
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "ok": true,
 *     }
 *
 * @apiUse NotEnoughInfoError
 * 
 * @apiUse SomethingWentWrongError
 */

routes.post('/errors', async (req, res) => {
    try {
        if (req.body.errors) {
            const errors = req.body.errors
            let valid = true
            errors.forEach(element => {
                if (!element.time || !element.error || !element.level || !element.errorinfo) valid = false
            });
            if (valid) {
                const mongoDb = getMongoDB()
                const result = await mongoDb.collection("errors").insertMany(errors)
                res.send({ ok: true })
            } else {
                res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
            }
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.error("\x1b[31m  addError: ", error, req.body)
        res.status(500).send({ ok: false, msg: error })
    }
})

module.exports = routes;