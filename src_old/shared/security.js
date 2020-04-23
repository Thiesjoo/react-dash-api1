const config = require('./config.js');
const randomstring = require("randomstring");
const bcrypt = require('bcrypt');
const saltRounds = config.saltRounds;
const jwt = require('jsonwebtoken');

//-Regex's
const emailRegex = RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
const passwordRegex = RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[0-9]).{5,100}$/
)

let checkToken = async (req, res, next) => {
    let cookies = req.cookies
    let token = cookies.accesstoken || req.body.token || req.query.token

    if (!token) {
        console.log("No token found for: ", req.ip)
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
            console.error("Error in security tokencheck. Invalid token for ip: ", req.ip)
            return res.status(401).send({
                ok: false,
                message: config.errors.invalidToken,
            });
        }
    }
};

let checkAdmin = async (req, res, next) => {
    try {
        const user = await getUserById(req.decoded.id)
        if (user && user.admin) {
            next()
        } else {
            return res.status(401).send({ ok: false, msg: config.errors.noPerms })
        }
    } catch (err) {
        console.error("\x1b[31m checkAdmin: ", err)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = { emailRegex, passwordRegex, saltRounds, bcrypt, randomstring, jwt, checkToken, checkAdmin }