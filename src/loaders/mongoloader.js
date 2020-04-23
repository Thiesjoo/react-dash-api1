const config = require('../config');

const mongoClient = require('mongodb').MongoClient

async function connectToMongo() {
    try {
        let newCon = await mongoClient.connect(config.mongoURL,
            { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 5000, socketTimeoutMS: 5000,serverSelectionTimeoutMS: 5000 })
        await newCon.db(config.databaseName)
    } catch (error) {
        throw error
    }
}

module.exports = connectToMongo