const express = require('express')
const app = express()

const config = require('./config');
const Logger = require("./loaders/logger")
const Loaders = require("./loaders")

async function startServer() {
    await Loaders(app)

    const server = app.listen(config.port, err => {
        if (err) {
            Logger.error(err);
            process.exit(1);
        }
        Logger.info(`Server listening on port: ${config.port}`);
    });

    server.on("error", (err) => {
        Logger.error(err)
        process.exit()
    })
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
}


startServer()