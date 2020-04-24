const express = require('express')
const app = express()

const config = require('./config');
const Logger = require("./loaders/logger")
const Loaders = require("./loaders")

Loaders(app)

const server = app.listen(config.port, err => {
    if (err) {
        Logger.error(err);
        process.exit(1);
    }
    Logger.info(`Server listening on port: ${config.port}`);
});

process.on('exit', function () {
    gracefulShutdown()
});

process.once('SIGUSR2', function () {
    gracefulShutdown(function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});

function gracefulShutdown(callback) {
    console.log("Closing server gracefully")
    if (server) server.close()
    callback()
}
