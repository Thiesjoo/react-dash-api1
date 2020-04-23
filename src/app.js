require("sexy-require")
const express = require('express')
const app = express()

const config = require('./config');
const Logger = require("./loaders/logger")
const Loaders = require("./loaders")


Loaders(app)

app.listen(config.port, err => {
    if (err) {
        Logger.error(err);
        process.exit(1);
    }
    Logger.info(`Server listening on port: ${config.port}`);
});