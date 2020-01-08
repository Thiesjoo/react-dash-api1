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
    // console.log("valid cookie in function check token: ", cookies.accesstoken ? "yes" : "no")
    let token = cookies.accesstoken

    //Mobile can't use cookies so check for token in body
    if (!token) {
        token = req.body.token
        console.log("Token not available in cookies")
        if (token && token.length == 5 && req.body.email) {
            next()
        } else {
            return res.status(401).json({
                ok: false,
                message: config.errors.notEnoughInfoTokens
            });
        }
    } else {
        try {
            const verifiedToken = await jwt.verify(token, config.secret)
            //If the decoded token is valid copy it to request and continue
            req.decoded = verifiedToken;
            next();
        } catch (error) {
            console.error("Error in security tokencheck")
            return res.status(401).send({
                ok: false,
                message: config.errors.invalidToken,
            });
        }
    }
};

module.exports = { emailRegex, passwordRegex, saltRounds, bcrypt, randomstring, jwt, checkToken }