const expressLoader = require("./expressloader")
const mongoLoader = require("./mongoloader")
const Logger = require("./logger")

module.exports = async (expressApp) => {
  const mongoConnection = await mongoLoader();
  Logger.info('✌️ DB loaded and connected!');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
}