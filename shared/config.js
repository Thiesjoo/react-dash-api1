const dev_errors = {
    accountNotFound: "Account not found",
    notFound: "It was not found",
    wrongPassword: "Password is wrong",
    invalidToken: "Token is invalid",
    notEnoughInfo: "There is not enough info",
    noRefresh: "Refresh token doesn't exist",
    general: "Something went wrong",
    alreadyExists: "Account already exists",
    regexNotMatch: "The regex is not valid",
    rateLimit: "You're doing that too fast",
    noPerms: "You have no permissions to access this route"
}

const prod_errors = {
    accountNotFound: "It was not found",
    notFound: "It was not found",
    wrongPassword: "It was not found",
    invalidToken: "Something went wrong",
    notEnoughInfo: "There is not enough info",
    noRefresh: "Something went wrong",
    general: "Something went wrong",
    alreadyExists: "Account already exists",
    regexNotMatch: "Something went wrong",
    rateLimit: "You're doing that too fast",
    noPerms: "Something went wrong"
}

const error = process.env.NODE_ENV == "production" ? prod_errors : dev_errors

module.exports = {
    production: process.env.NODE_ENV == "production" ? true : false,
    zeit: true,

    errors: error,
    secret: process.env.JWT_SECRET,
    mysqlPassword: process.env.DB_PASS,
    database_name: process.env.DB_NAME,
    saltRounds: 14,
    accessExpiry: 900000,
    refreshExpiry: 604800000,
    tokenLength: 20,
    httpsPort: process.env.NODE_ENV == "production" ? 8080 : 8090, // Use a different port while developing, so you can host the server for dev and prod at the same time
    allowedTypes: ["tasks", "notifications", "banking"],
    allowedFormats: {tasks: ["title", "id", "text", "priority"], notifications: ["title", "message", "app", "time", "persistent", "icon", "key"]}
}