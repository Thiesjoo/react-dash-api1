let {getMongoDB} = require("../shared/database")
const routes = require('express').Router();

console.error("USING DEV ROUTES.")
console.error("DEV ROUTE CONSEQUENSES: CORS IS ENABLED, DEV ROUTES ARE ON(Delete entire tables, list all data), DEV COOKIES ARE ON, USING LOCAL DATABASE")

routes.get('/', (req, res) => {
    console.log(req.ip)
    res.send("Welcome to my API. This is not meant for people to see. If you see this: PLEASE GO AWAY")
})

routes.get("/mongo", async (req,res) => {
    try {
        var db = getMongoDB()
        let test = db.collection("users")
        const result = await test.find({  }).toArray();
        res.send(result);
    } catch(e) {
        console.error(e)
        res.send(e)
    }
})

routes.get("/mongoDrop", async (req,res) => {
    try {
        var db = getMongoDB()
        let test = db.collection("users")
        test.drop()
        test = db.collection("errors")
        test.drop()

        res.send(true);
    } catch(e) {
        console.error(e)
        res.send(e)
    }
})

routes.get("/errors", async (req,res) => {
    try {
        var db = getMongoDB()
        let test = await db.collection("errors").find({  }).toArray()
        res.json(test);
    } catch(e) {
        console.error(e)
        res.send(e)
    }
})

module.exports = routes;