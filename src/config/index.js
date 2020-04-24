let url = ""
if (process.env.MONGOURL) {
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

    errors: {
        accountNotFound: "Email/password combination in not correct",
        notFound: "Item not found",
        wrongPassword: "Email/password combination in not correct",
        invalidToken: "Your token is invalid",
        notEnoughInfo: "There is not enough info",
        noRefresh: "Refresh token not present",
        general: "Something went wrong",
        alreadyExists: "Account already occupied",
        regexNotMatch: "Invalid input",
        noPerms: "Not enough permissions to do this action",
        notEnoughInfoTokens: "There is not enough info",
        invalidInfo: "Invalid input",
        tooMuchSpace: "Your account occupies too much space in the database. Please stop adding more items",
        accountDeletion: "This account was deleted and it is blocked due to user spoofing reasons",
        rateLimit: "You're doing that too fast!"
    },

    security: {
        emailRegex: RegExp(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
        passwordRegex: RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[0-9]).{5,100}$/
        )
    }
}