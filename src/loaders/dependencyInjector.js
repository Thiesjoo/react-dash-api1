const Container = require("typedi").Container
const Logger = require("./logger")
const config = require("../config")

module.exports = async (mongoConnection) => {
    try {
        await Container.set("logger", Logger)
        await Container.set("db", mongoConnection)
        await Container.set("config", config)
        Logger.debug("Loaded config, db-connection and logger")


        const DBModels = require("../models/user.js")
        await Container.set("models",DBModels )
        Logger.debug("Loaded DB models")


        const dbFunctions = require("../helpers/dbFunctions")
        await Container.set("db-functions", dbFunctions)
        Logger.debug("Loaded DB Functions")

        const middlewares = require("../api/middelwares/index.js")
        await Container.set("middlewares", middlewares)
        Logger.debug("Loaded middlewares")

    } catch (e) {
        Logger.error('Error on dependency injector loader: %o', e);
        throw e;
    }
}