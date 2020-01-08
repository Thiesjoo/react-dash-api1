let { getMongoDB } = require("../shared/database")
const routes = require('express').Router();
const config = require("../shared/config")

console.error("USING DEV ROUTES.")
console.error("DEV ROUTE CONSEQUENSES: CORS IS ENABLED, DEV ROUTES ARE ON(Delete entire tables, list all data), DEV COOKIES ARE ON, USING LOCAL DATABASE")

if (!config.production) {

    /**
 * @api {get} /mongo Return all users in database
 * @apiName mongo
 * @apiGroup DEV
 * @apiPrivate
 */
    routes.get("/mongo", async (req, res) => {
        try {
            var db = getMongoDB()
            let test = db.collection("users")
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
* @apiPrivate
*/
    routes.get("/mongoDrop", async (req, res) => {
        try {
            var db = getMongoDB()
            let test = db.collection("users")
            test.drop()
            test = db.collection("errors")
            test.drop()

            res.send(true);
        } catch (e) {
            console.error(e)
            res.send(e)
        }
    })

    /**
* @api {get} /errors Return all errors
* @apiName errors
* @apiGroup DEV
* @apiPrivate
*/

    routes.get("/errors", async (req, res) => {
        try {
            var db = getMongoDB()
            let test = await db.collection("errors").find({}).toArray()
            res.json(test);
        } catch (e) {
            console.error(e)
            res.send(e)
        }
    })
}

module.exports = routes;
