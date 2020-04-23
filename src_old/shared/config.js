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
    zeit: true,

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
    secret: process.env.JWT_SECRET || "YaYeet",
    saltRounds: production ? 14 : 14,
    accessExpiry: 900000,
    refreshExpiry: 604800000,
    tokenLength: 20,
    allowedTypes: ["tasks", "notifications", "banking", "profile", "items"],
    allowedFormats: { tasks: ["title", "msg", "priority", "children", /*List of id's*/ "child" /* Boolean:if current object is a child */], notifications: ["title", "message", "type", "created", "ttl", "color"], banking: ["title", "amount", "msg", "time", "repeatInterval"], items: ["type", "options"] },
    permissions: { tasks: "r/w", notifications: "r/w", banking: "r/w", profile: "r", items: "r/w" }
}


/**
 * @apiDefine admin Admin users access only
 * You can only become an admin in a DEV environment or by changing the database
 */

 /**
 * @apiDefine DEV Dev
 * This is a group for routes that are not meant for production.
 * They all return the literal error that is generated.
 */

/**
 * @apiDefine public Public
 * Routes accessible for everyone
 */

 /**
 * @apiDefine refresh Refresh routes
 * Routes where you need your refresh-token
 */



/* ----------------------------- General errors ----------------------------- */

/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFound The id/email of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "ok": false,
 *       "msg": "Email/password combination in not correct"
 *     }
 */

/**
 * @apiDefine NotFoundError
 *
 * @apiError ItemNotFound The item you were searching for was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "ok": false,
 *       "msg": "Item not found"
 *     }
 */

/**
 * @apiDefine NotEnoughInfoError
 *
 * @apiError NotEnoughInfo You do not meet the request's parameters.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad request
 *     {
 *       "ok": false,
 *       "msg": "There is not enough info"
 *     }
 */

 /**
 * @apiDefine InvalidInfoError
 *
 * @apiError InvalidInfo You do not meet the request's parameters.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad request
 *     {
 *       "ok": false,
 *       "msg": "Invalid input"
 *     }
 */

/**
 * @apiDefine NotEnoughPermissions
 *
 * @apiError NotEnoughPermissions Not enough permissions to do this action
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "ok": false,
 *       "msg": "Not enough permissions to do this action"
 *     }
 */

/**
 * @apiDefine InvalidToken
 *
 * @apiError InvalidToken Your token is invalid
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "ok": false,
 *       "msg": "Your token is invalid"
 *     }
 */

 /**
 * @apiDefine RateLimit
 *
 * @apiError RateLimit You're doing that too fast!
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 429 Too many requests
 *     {
 *       "ok": false,
 *       "msg": "You're doing that too fast!"
 *     }
 */


/**
 * @apiDefine SomethingWentWrongError
 *
 * @apiError (500 Internal Server Error) SomethingWentWrong Something went wrong with the server.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal server error
 *     {
 *       "ok": false,
 *       "msg": "Something went wrong"
 *     }
 */

 /**
 * @apiDefine NoRefresh
 *
 * @apiError NoRefresh Refresh token is not there
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal server error
 *     {
 *       "ok": false,
 *       "msg": "Refresh token not present"
 *     }
 */



 /**
 * @apiDefine TooMuchSpaceError
 *
 * @apiError TooMuchSpace The production server has a limit of 5 mb per profile
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal server error
 *     {
 *       "ok": false,
 *       "msg": "Your account occupies too much space in the database. Please stop adding more items"
 *     }
 */


/* -------------------------- Login/signup specific ------------------------- */

 /**
 * @apiDefine AccountDeletionError
 *
 * @apiError AccountDeletion The account was deleted and is now unavailable.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "ok": false,
 *       "msg": "This account was deleted and it is blocked due to user spoofing reasons"
 *     }
 */

 /**
 * @apiDefine WrongPasswordError
 *
 * @apiError WrongPassword The password for this user is incorrect.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "ok": false,
 *       "msg": "Email/password combination in not correct"
 *     }
 */

  /**
 * @apiDefine RegexNotMatchError
 *
 * @apiError RegexNotMatch The password or the email is not valid according to our rules.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad request
 *     {
 *       "ok": false,
 *       "msg": "Invalid input"
 *     }
 */

/* ------------------------- General error messages ------------------------- */
/**
 * @apiDefine RawError
 *
 * @apiError (500 Internal Server Error) RawError Something went wrong
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal server error
 *     {
 *       "ok": false,
 *       "msg": (Error message)
 *     }
 */