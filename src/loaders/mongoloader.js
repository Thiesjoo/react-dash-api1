const config = require('../config');
const mongoose = require("mongoose")

async function connectToMongo() {
    try {
        let newCon = await mongoose.connect(config.mongoURL,
            { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 5000, socketTimeoutMS: 5000,serverSelectionTimeoutMS: 5000 })
        return newCon.connection.db
    } catch (error) {
        throw error
    }
}

module.exports = connectToMongo