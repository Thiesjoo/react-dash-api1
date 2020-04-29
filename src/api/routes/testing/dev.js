const Container = require("typedi").Container
const db = Container.get("db")
const Logger = Container.get("logger")
const config = Container.get("config")
const TokenValidation = Container.get("middlewares").checkToken
const UserModel = require("../../../models/user").UserModel

const routes = require('express').Router();

if (!config.production) {

    Logger.warn("USING DEV ROUTES.")
    Logger.warn("DEV ROUTE CONSEQUENSES: CORS IS ENABLED, DEV ROUTES ARE ON(Delete entire tables, list all data), DEV COOKIES ARE ON, USING LOCAL DATABASE")

    /**
 * @api {get} /mongo Return all users in database
 * @apiName mongo
 * @apiGroup DEV
 * @apiUse RawError
 * @apiPrivate
 */
    routes.get("/mongo", async (req, res, next) => {
        try {
            const result = await UserModel.find({})
            res.send(result);
        } catch (e) {
            next(e)
        }
    })


    /**
* @api {get} /mongoDROP Drop database
* @apiDescription Drop all collections and regenerate user collection
* @apiName mongoDrop
* @apiGroup DEV
* @apiUse RawError
* @apiPrivate
*/
    routes.get("/mongoDrop", async (req, res, next) => {
        try {
            await UserModel.deleteMany({})
            res.send(true);
        } catch (e) {
            next(e)
        }
    })


    /**
* @api {get} /promote Promote user to admin
* @apiName promote
* @apiParam {String} email Users unique email.
* @apiGroup DEV
* @apiUse RawError
* @apiPrivate
*/
    routes.get("/promote", async (req, res, next) => {
        try {
            if (req.query.email) {
                UserModel.updateOne({ email: req.query.email }, { $set: { admin: true } })
                Logger.warn(`Promoted user: ${req.query.email}`)
                res.send(true);
            } else {
                throw new Error(config.errors.notEnoughInfo)
            }
        } catch (e) {
            next(e)
        }
    })

    /**
* @api {get} /errors Return all errors
* @apiName errors
* @apiGroup DEV
* @apiUse RawError
* @apiPrivate
*/

    // routes.get("/errors", async (req, res, next) => {
    //     try {
    //         let test = await db.collection("errors").find({}).toArray()
    //         res.json(test);
    //     } catch (e) {
    //         next(e)
    //     }
    // })

    /**
* @api {get} /mongoStatus Return the database status
* @apiName Stats
* @apiGroup DEV
* @apiUse RawError
* @apiPrivate
*/
    routes.get("/mongoStatus", async (req, res, next) => {
        try {
            let test = await db.stats()
            res.json(test);
        } catch (e) {
            next(e)
        }
    })


    routes.post("/testBody", function (req, res) {
        Logger.debug(`Received test request with body: ${req.body}`)
        res.send(req.body)
    })

    routes.post("/user/testValidation", TokenValidation, function (req, res) {
        Logger.debug(`Validated user account: ${req.decoded.id}`)
        res.send({ ok: true, result: req.decoded })
    })

    routes.post("/user/testCookies", (req,res) => {
        Logger.debug("Got cookie request")
        res.json(req.cookies)
    })
}

module.exports = routes;
