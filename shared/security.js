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

let checkToken = (req, res, next) => {
    var body = req.body
    var cookies = req.cookies
    // console.log("valid cookie in function check token: ", cookies.accesstoken ? "yes" : "no")
    var token = cookies.accesstoken
    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({
                    ok: false,
                    message: config.errors.invalidToken
                });
            } else {
                //If the decoded token is valid copy it to request and continue
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            ok: false,
            message: config.errors.notEnoughInfo
        });
    }
};

module.exports = {emailRegex, passwordRegex, saltRounds, bcrypt,randomstring, jwt, checkToken}