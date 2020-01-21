let { getMongoDB } = require("../shared/database")
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
 */
    routes.get("/mongo", async (req, res) => {
        try {
            let db = getMongoDB()
            let test = db.collection("users")
            if (!test) res.sendStatus(404)
            const result = await test.find({}).toArray();
            res.send(result);
        } catch (e) {
            console.error(e)
            res.send(e)
        }
    })


    /**
* @api {get} /mongoDROP Delete all users
* @apiName mongoDrop
* @apiGroup DEV
*/
    routes.get("/mongoDrop", async (req, res) => {
        try {
            let db = getMongoDB()
            // let test = db.collection("users")
            // console.log(test)
            // if (test) test.drop()
            // test = db.collection("errors")
            // console.log(test)

            // if (test) test.drop()

            await db.dropDatabase()

            res.send(true);
        } catch (e) {
            console.error(e)
            res.send(e)
        }
    })


    /**
* @api {get} /promote Promote user to admin
* @apiName promote
* @apiParam {String} email Users unique email.
* @apiGroup DEV
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
            res.send(e)
        }
    })

    /**
* @api {get} /errors Return all errors
* @apiName errors
* @apiGroup DEV
*/

    routes.get("/errors", async (req, res) => {
        try {
            let db = getMongoDB()
            let test = await db.collection("errors").find({}).toArray()
            res.json(test);
        } catch (e) {
            console.error(e)
            res.send(e)
        }
    })
}

routes.post("/test", function(req,res) {
    console.log("Received test request with body", req.body)
    res.send(req.body)
})

routes.post("/testCookie", security.checkToken,function (req,res) {
    console.log("Received testCOOKIe request with body", req.body, req.decoded)

    res.send({ok:true, result: req.decoded})
})

module.exports = routes;
