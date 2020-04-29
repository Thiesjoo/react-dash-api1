const randomstring = require("randomstring");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Container = require("typedi").Container
const Logger = Container.get("logger")

const config = require("../config")
const { getUserByEmail, updateTokens, addUser } = require("../helpers/dbFunctions")

async function login(email, password, platform, useragent) {
    if (!email || !password) throw new Error(config.errors.notEnoughInfo)
    if (!config.security.emailRegex.test(email) || !config.security.passwordRegex.test(password)) throw new Error(config.errors.regexNotMatch)
    Logger.silly("Validated email")

    const user = await getUserByEmail(email)
    if (!user) throw new Error(config.errors.accountNotFound)
    Logger.silly("Got user")

    if (user.password === "") {
        Logger.silly("Account was deleted")
        let error
        if (user.timeOfDeletion) {
            error = new Error(config.errors.accountDeletion)
            error["status"] = 401
        } else {
            error = new Error(config.errors.general)
        }
        throw error
    } else {
        let passwordsSame = await bcrypt.compare(password, user.password)
        if (!passwordsSame) throw new Error(config.errors.wrongPassword)
        Logger.silly("Validated password")

        let accesstoken = jwt.sign({ email: email, id: user._id },
            config.secret,
            {
                expiresIn: config.accessExpiry
            }
        );
        let realtoken = randomstring.generate(config.tokenLength)
        let refreshtoken = jwt.sign({ token: realtoken }, config.secret, { expiresIn: config.accessExpiry });
        let refreshArray = user.token
        Logger.silly("Generated refresh and access token")

        //Add the new token
        refreshArray.push({ token: realtoken, platform: platform, useragent: useragent, expiry: new Date(Date.now() + config.refreshExpiry) })

        //Remove all expired tokens
        let currentDate = new Date(Date.now())
        refreshArray = refreshArray.filter(item => item.expiry > currentDate)
        Logger.silly("Updated token array(In mem)")

        await updateTokens(user._id, refreshArray)
        Logger.silly("Updated token array(In db)")

        return { user, refreshtoken, accesstoken }
    }
}


async function signup(email, password, firstname, lastname, platform, useragent) {
    if (!email || !password || !firstname || !lastname) throw new Error(config.errors.notEnoughInfo)
    Logger.silly("Body parts are available")
    if (!config.security.emailRegex.test(email) || !config.security.passwordRegex.test(password)) throw new Error(config.errors.regexNotMatch)
    Logger.silly("Validated email and first/last name")

    const user = await getUserByEmail(email)
    Logger.silly("Tried getting user")

    if (user) {
        Logger.silly("Account already exists")
        let error
        if (user.timeOfDeletion) {
            error = new Error(config.errors.accountDeletion)
            error["status"] = 401
        } else {
            error = new Error(config.errors.alreadyExists)
            error["status"] = 400
        }
        throw error
    } else {
        let hash = await bcrypt.hash(password, config.saltRounds)
        let realtoken = randomstring.generate(config.tokenLength)
        let refreshtoken = jwt.sign({ token: realtoken }, config.secret, { expiresIn: config.accessExpiry });
        let refreshArray = [{ token: realtoken, platform: platform, useragent: useragent, expiry: new Date(Date.now() + config.refreshExpiry) }]

        let newUser = await addUser(email, firstname, lastname, hash, refreshArray)
        let accesstoken = jwt.sign({ email: email, id: newUser._id },
            config.secret,
            {
                expiresIn: config.accessExpiry
            }
        );

        return { user: newUser, refreshtoken, accesstoken }
    }
}

module.exports = { login, signup }