let url = ""
if ( process.env.MONGOURL) {
    url = process.env.MONGOURL
} else {
    let ip = "localhost"
    url = `mongodb://${ip}:27017/`
}

const production = process.env.NODE_ENV == "production" ? true : false

module.exports = {
    production,
    databaseName: production ? "users" : "users_dev",
    mongoURL: url,
    port: process.env.PORT || 8090, 


    logs: {
        level: process.env.LOG_LEVEL || 'silly',
      },
}