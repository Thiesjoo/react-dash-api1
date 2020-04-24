const Router = require("express").Router
const testing = require("./routes/testing")

module.exports = () => {
    const app = Router()
    testing(app) //Dev routes, hello world route

    return app
}