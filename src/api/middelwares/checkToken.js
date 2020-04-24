const Container =  require("typedi").Container

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
            //If the decoded token is valid copy it to request and continue
            req.decoded = verifiedToken;
            next();
        } catch (error) {
            // console.error("Error in security tokencheck. Invalid token for ip: ", req.ip)
            next(new Error(config.errors.invalidToken))
            // return res.status(401).send({
            //     ok: false,
            //     message: ,
            // });
        }
    }
};