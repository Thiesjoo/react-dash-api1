module.exports = {
    errors: {
        accountNotFound: "Account not found",
        notFound: "It was not found",
        wrongPassword: "Password is wrong",
        invalidToken: "Token is invalid",
        notEnoughInfo: "There is not enough info",
        noRefresh: "Refresh token doesn't exist",
        general: "Something went wrong",
        alreadyExists: "Account already exists",
        regexNotMatch: "The regex is not valid"
    },
    secret: process.env.JWT_SECRET,
    mysqlPassword: process.env.DB_PASS,
    database_name: process.env.DB_NAME,
    saltRounds: 14,
    accessExpiry: 900000,
    refreshExpiry: 604800000,
    tokenLength: 20,
    expressPort: 8080,
    allowedTypes: ["tasks"],
    allowedFormats: {tasks: ["id", "message", "title", "priority"]}
}