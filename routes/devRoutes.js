const con = require("../shared/database").con
const simpleQuery = require("../shared/database").simpleQuery
const routes = require('express').Router();

console.error("USING DEV ROUTES. IF YOU SEE THIS IN PROD YOUR FUCKED")
console.error("THIS ALSO MEANS THAT: CORS IS ENABLED, DEV ROUTES ARE ON, DEV COOKIES ARE ON, DB IS USING TEST TABLE AND LOCAL ENV IS LOADED ")

routes.get('/', (req, res) => {
    console.log(req.ip)
    res.cookie("test", "test")
    res.send("Testing dev routes and adding cookies")
})

routes.get('/user', (req, res) => {
    console.log("Cookies: ",req.cookies)
    res.send({ok:true, cookies: req.cookies})
})

routes.get('/remove', (req, res) => {
    res.cookie("test", "test")
    res.send("Testing dev routes and removing cookies")
})


routes.post("/nottest", (req,res) => {
    console.log(req.body)
    res.send({ok:true})
})

routes.get("/delete", (req, res) => {
    simpleQuery("TRUNCATE users;")
    console.warn("Database deleted")
    res.send("OK")
})

routes.get("/list", (req, res) => {
    con.query("SELECT * FROM users", function (err, result) {
        if (err) {
            res.status(404).end()
            throw err
        }
        result.forEach(element => {
            element.token = JSON.parse(element.token)
            element.data = JSON.parse(element.data)
            element.tasks = JSON.parse(element.tasks)

        });
        res.json(result)
        res.end()
    })
})

module.exports = routes;