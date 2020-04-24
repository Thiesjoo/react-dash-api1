// const Container= require("typedi").Container
// const Logger = Container.get("logger")
// const config = Container.get("config")
// const db = Container.get("db")

const dev = require("./dev")
module.exports = (app) => {
    app.get("/", (req,res) => {
        res.json({ok: true, msg: "Hello world!"})
    })
    app.use(dev)
}