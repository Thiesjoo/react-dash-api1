let { getMongoDB, addUser, deleteAccount } = require("../shared/database")
const routes = require('express').Router();
const config = require("../shared/config")
const security = require("../shared/security")


if (!config.production) {

    console.error("USING DEV ROUTES.")
    console.error("DEV ROUTE CONSEQUENSES: CORS IS ENABLED, DEV ROUTES ARE ON(Delete entire tables, list all data), DEV COOKIES ARE ON, USING LOCAL DATABASE")

    /**
 * @api {get} /mongo Return all users in database
 * @apiName mongo
 * @apiGroup DEV
 * @apiUse RawError
 * @apiPrivate
 */
    routes.get("/mongo", async (req, res) => {
        try {
            let db = getMongoDB()
            let test = db.collection("users")
            if (!test) res.sendStatus(500)
            const result = await test.find({}).toArray();
            res.send(result);
        } catch (e) {
            console.error(e)
            res.status(500).send(e)
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
    routes.get("/mongoDrop", async (req, res) => {
        try {
            let db = getMongoDB()
            await db.dropDatabase()
            const user = await addUser("temp@temp.com", "Temp", "Temp", "", [])
            await deleteAccount(user._id, user.email)
            res.send(true);
        } catch (e) {
            console.error(e)
            res.status(500).send(e)
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
    routes.get("/promote", async (req, res) => {
        try {
            if (req.query.email) {
                let db = getMongoDB()
                let test = db.collection("users")
                test.updateOne({ email: req.query.email }, { $set: { admin: true } })
                res.send(true);
            } else {
                res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
            }
        } catch (e) {
            console.error(e)
            res.status(500).send(e)
        }
    })

    /**
* @api {get} /errors Return all errors
* @apiName errors
* @apiGroup DEV
* @apiUse RawError
* @apiPrivate
*/

    routes.get("/errors", async (req, res) => {
        try {
            let db = getMongoDB()
            let test = await db.collection("errors").find({}).toArray()
            res.json(test);
        } catch (e) {
            console.error(e)
            res.status(500).send(e)
        }
    })

    /**
* @api {get} /mongoStatus Return the database status
* @apiName Stats
* @apiGroup DEV
* @apiUse RawError
* @apiPrivate
*/
    routes.get("/mongoStatus", async (req, res) => {
        try {
            let db = getMongoDB()
            let test = await db.stats()
            res.json(test);
        } catch (e) {
            console.error(e)
            res.status(500).send(e)
        }
    })


    routes.post("/test", function (req, res) {
        console.log("Received test request with body: ", req.body)
        res.send(req.body)
    })

    routes.post("/testCookie", security.checkToken, function (req, res) {
        console.log("Received testCOOKIE request with body: ", req.body, " and cookie: ",req.decoded)

        res.send({ ok: true, result: req.decoded })
    })

}

module.exports = routes;
