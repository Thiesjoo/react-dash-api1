const dependencyInjector = require("./dependencyInjector")
const mongoLoader = require("./mongoloader")

const Logger = require("./logger")

module.exports = async (expressApp) => {
  const mongoConnection = await mongoLoader();
  Logger.info('DB loaded and connected!');

  await dependencyInjector(mongoConnection)
  Logger.info("Dependency injector loaded")

  const expressLoader = require("./expressloader")

  await expressLoader({ app: expressApp });
  Logger.info('Express loaded');
}