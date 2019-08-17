const con = require("../shared/database").con
const simpleQuery = require("../shared/database").simpleQuery
const routes = require('express').Router();

console.error("USING DEV ROUTES. IF YOU SEE THIS IN PROD YOUR FUCKED")
console.error("THIS ALSO MEANS THAT: CORS IS ENABLED, DEV ROUTES ARE ON, DEV COOKIES ARE ON, DB IS USING TEST TABLE AND LOCAL ENV IS LOADED ")

routes.get('/', (req, res) => {
    res.send("Testing dev routes")
})

routes.get("/delete", (req, res) => {
    simpleQuery("TRUNCATE users;")
    res.send("OK")
})

routes.get("/list", (req, res) => {
    con.query("SELECT * FROM users", function (err, result) {
        if (err) {
            res.status(404).end()
            throw err
        }
        res.send(result)
    })
})

module.exports = routes;