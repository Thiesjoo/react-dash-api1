const Router = require("express").Router
const testing = require("./routes/testing")
const user = require("./routes/user")


module.exports = () => {
    const app = Router()
    testing(app) //Dev routes, hello world route
    user(app)

    return app
}