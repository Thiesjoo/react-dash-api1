const auth = require("./auth.route")
const crud = require("./crud.route")

module.exports = (app) => {
    app.use(auth)
    app.use(crud)
}