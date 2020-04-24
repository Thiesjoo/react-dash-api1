const Container = require("typedi").Container
const Logger = Container.get("logger")
const config = Container.get("config")
const errorList = Object.values(config.errors)

module.exports = (app) => {
  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error(config.errors.notFound);
    err['status'] = 404;
    next(err);
  });


  app.use((err, req, res, next) => {
    Logger.error(err)

    res.status(err.status || errorList.includes(err.message) ? 400 : 500);
    res.json({
      ok: false,
      msg: err.message,
    });
  });
}