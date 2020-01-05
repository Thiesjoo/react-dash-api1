const devErrors = {
    accountNotFound: "Account not found",
    notFound: "Not found",
    wrongPassword: "Password is wrong",
    invalidToken: "Token is invalid",
    notEnoughInfo: "There is not enough info",
    noRefresh: "Refresh token doesn't exist",
    general: "Something went wrong",
    alreadyExists: "Account already exists",
    regexNotMatch: "Invalid input",
    noPerms: "You have no permissions to access this route",
    notEnoughInfoTokens: "Token is not present",
    invalidInfo: "Invalid input",
    tooMuchSpace: "Your account occupies too much space in the database. Please stop adding more items"
}

const prodErrors = {
    accountNotFound: "Email/password combination in not correct",
    notFound: "Item not found",
    wrongPassword: "Email/password combination in not correct",
    invalidToken: "Something went wrong",
    notEnoughInfo: "There is not enough info",
    noRefresh: "There is not enough info",
    general: "Something went wrong",
    alreadyExists: "Account already occupied",
    regexNotMatch: "Invalid input",
    noPerms: "Something went wrong",
    notEnoughInfoTokens: "There is not enough info",
    invalidInfo: "Invalid input",
    tooMuchSpace: "Your account occupies too much space in the database. Please stop adding more items"
}

const error = process.env.NODE_ENV == "production" ? prodErrors : devErrors

let url = ""
if ( process.env.MONGOURL) {
    url = process.env.MONGOURL
} else {
    let ip = "localhost"
    const isDocker = require('is-docker');
    const isdocker = isDocker()
    if (isdocker) {
        console.log("Is in docker")
        ip = "db"
        console.log("Debugging info: ", config)
    }
    url = `mongodb://${ip}:27017/`
}

module.exports = {
    production: process.env.NODE_ENV == "production" ? true : false,
    databaseName: this.production ? "users" : "users_dev",

    mongoURL: url,
    zeit: true,

    errors: error,
    secret: process.env.JWT_SECRET,
    saltRounds: 14,
    accessExpiry: 900000,
    refreshExpiry: 604800000,
    tokenLength: 20,
    httpsPort: process.env.NODE_ENV == "production" ? 8080 : 8090, // Use a different port while developing, so you can host the server for dev and prod at the same time
    allowedTypes: ["tasks", "notifications", "banking", "profile", "items"],
    allowedFormats: { tasks: ["title", "msg", "priority", "children", /*List of id's*/ "child" /* Boolean:if current object is a child */], notifications: ["title", "message", "type", "created", "ttl", "color"], banking: ["title", "amount", "msg", "time", "repeatInterval"], items: ["name", "options"] },
    permissions: { tasks: "r/w", notifications: "r/w", banking: "r/w", profile: "r", items: "r/w" }
}