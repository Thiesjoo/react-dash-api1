const Container =  require("typedi").Container
const jwt = require("jsonwebtoken")

const Logger = Container.get("logger")
const config = Container.get("config")

module.exports = async (req, res, next) => {
    let cookies = req.cookies
    let token = cookies.accesstoken || req.body.token || req.query.token

    if (!token) {
        Logger.debug(`No token found for: ${req.ip}`)
        return res.status(401).json({
            ok: false,
            message: config.errors.notEnoughInfoTokens
        });
    } else {
        try {
            const verifiedToken = await jwt.verify(token, config.secret)
            req.decoded = verifiedToken;
            
            next();
        } catch (error) {
            next(new Error(config.errors.invalidToken))
        }
    }
};