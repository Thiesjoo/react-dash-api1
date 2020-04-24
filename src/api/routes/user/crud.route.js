const routes = require('express').Router();
const checkToken = require("../../middelwares/checkToken")

routes.get("/user/profile/item",checkToken, require("./CRUD/getItem"))
// routes.post("/user/addItem", require("./CRUD/addItem"))
// routes.delete("/user/deleteItem", require("./CRUD/deleteItem"))
// routes.put("/user/updateItem", require("./CRUD/updateItem"))

module.exports = routes;