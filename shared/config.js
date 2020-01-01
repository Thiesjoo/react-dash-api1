const devErrors = {
    accountNotFound: "Account not found",
    notFound: "Not found",
    wrongPassword: "Password is wrong",
    invalidToken: "Token is invalid",
    notEnoughInfo: "There is not enough info",
    noRefresh: "Refresh token doesn't exist",
    general: "Something went wrong",
    alreadyExists: "Account already exists",
    regexNotMatch: "The regex is not valid",
    rateLimit: "You're doing that too fast",
    noPerms: "You have no permissions to access this route",
    notEnoughInfoTokens: "Token is not present",
    invalidInfo: "The info supplied is not valid"
}

const prodErrors = {
    accountNotFound: "Not found",
    notFound: "Not found",
    wrongPassword: "Not found",
    invalidToken: "Something went wrong",
    notEnoughInfo: "There is not enough info",
    noRefresh: "Something went wrong",
    general: "Something went wrong",
    alreadyExists: "Account already exists",
    regexNotMatch: "Something went wrong",
    rateLimit: "You're doing that too fast",
    noPerms: "Something went wrong",
    notEnoughInfoTokens: "There is not enough info",
    invalidInfo: "The info supplied is not valid"
}

const error = process.env.NODE_ENV == "production" ? prodErrors : devErrors

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
    allowedTypes: ["tasks", "notifications", "banking", "profile"],
    allowedFormats: {tasks: ["title", "message", "priority", "children", /*List of id's*/ "child" /* Boolean:if current object is a child */ ], notifications: ["title", "message", "type", "created", "ttl", "color"], banking: ["title"]},
    permissions: {tasks: "r/w", notifications: "r/w", banking: "r/w", profile: "r"}
}