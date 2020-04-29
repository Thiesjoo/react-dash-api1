const mongoose = require("mongoose")

const Token = new mongoose.Schema(
    {
        token: { type: String, required: true },
        useragent: {type: String, default: ""},
        platform: {type: String, default: ""},
        expiry: { type: Date, required: true }
    }, { _id: false })

const User = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    token: [Token],

    data: {
        profile: {
            firstname: { type: String, required: true },
            lastname: { type: String, required: true },
            email: { type: String, required: true },
            emailVerified: { type: Boolean, default: false }
        },
        preferences: {
            dark: {type: Boolean, default: true},
            stylePC: {type: Number, default: 1},
            styleMOBILE: {type: Number, default: 1}
        }
    }
})

var UserModel = mongoose.model("user_schema", User)

module.exports = { UserModel }