const isDocker = require('is-docker');
const config = require('./config.js');

let ip = "localhost"
let isdocker = isDocker()
if (isdocker) {
    console.log("Is in docker")
    ip = "db"
    console.log("Debugging info: ", config)
}

// #region MongoConfig
const mongoRequire = require('mongodb')
const mongoClient = mongoRequire.MongoClient;
const mongoUrl = `mongodb://${ip}:27017/`;
let mongoDb = null
connectToMongo().catch(error => {
    throw error
})

async function connectToMongo() {
    let newCon = await mongoClient.connect(mongoUrl,
        { useNewUrlParser: true, useUnifiedTopology: true })
    mongoDb = newCon.db("users_test")
}

// #endregion

// #region CRUD

function getMongoDB() {
    return mongoDb
}

async function getUserMongo(email) {
    return mongoDb.collection("users").findOne({ email })
}

async function addUserMongo(email, firstname, lastname, password, token) {
    const notifications = [
        { id: new mongoRequire.ObjectID(), color: "warning", message: "Your email is not verified yet", type: "info", created: new Date() },
    ]
    const tempId = new mongoRequire.ObjectID()
    const tasks = {
        "Your first list": [
            {
                id: new mongoRequire.ObjectID(),
                title: "Verify your email",
                message: "You can just click the link that has been sent to you",
                priority: 4,
                children: [tempId],
                child: false
            },
            {
                id: tempId,
                title: "Sub item test",
                message: "You can just click the link that has been sent to you",
                priority: 4,
                children: [],
                child: true
            }
        ]
    }
    const dashboard = {
        items: {
            home: [{ name: "ToDo", options: { list: "Your first list"} }]
        }
    }
    return mongoDb.collection("users").insertOne({ email, password, token, data: {dashboard, tasks, notifications, profile: { firstname, lastname, email, emailVerified: false } } })
}

async function updateTokensMongo(email, newTokens) {
    return mongoDb.collection("users").updateOne({ email }, { $set: { token: newTokens } })
}

async function getItem(id, list, type, email) {
    if (config.permissions[type].includes("r")) {
        let user = await getUserMongo(email)
        if (user) {
            console.log(list)
            if (user.data[type] && list !== undefined && user.data[type][list]) {
                let withId;
                if (id) {
                    withId = user.data[type][list].find(item => item.id == id)
                }
                if (withId) {
                    return withId
                } else {
                    return user.data[type][list]
                }
            } else if (user.data[type] && list == undefined) {
                return user.data[type]
            } else {
                return null
            }
        } else {
            throw "No user"
        }
    } else {
        throw "Not allowed"
    }
}


async function addItem(item, list, type, email) {
    if (config.permissions[type].includes("w")) {
        if (config.allowedTypes.includes(type)) {
            let valid = true
            config.allowedFormats[type].forEach(x => {
                if (!(x in item)) {
                    valid = false
                }
            })
            if (config.allowedFormats[type].length != Object.keys(item).length) valid = false
            if (valid) {
                item.id = new mongoRequire.ObjectID()
                let user = await getUserMongo(email)
                if (user) {
                    if (user.data[type] && !user.data[type][list]) {
                        user.data[type][list] = []
                    } else if (!user.data[type]) {
                        user.data[type] = {}
                        user.data[type][list] = []
                    }
                    user.data[type][list].push(item)
                    let mongoResult = await mongoDb.collection("users").updateOne({ email }, { $set: { data: user.data } })
                    if (mongoResult.result.ok != 1) throw "Database unresponsive"
                    return user.data[type][list]
                } else {
                    throw "No user"
                }
            } else {
                throw "Not a valid item"
            }
        } else {
            throw "Not allowed"
        }
    } else {
        throw "Not allowed"
    }
}


async function deleteItem(id, list, type, email) {
    if (config.permissions[type].includes("w")) {
        if (config.allowedTypes.includes(type)) {
            let user = await getUserMongo(email)
            if (user) {
                if (user.data[type][list]) {
                    user.data[type][list] = user.data[type][list].filter(function (value, index) {
                        return value.id != id
                    });
                    let mongoResult = await mongoDb.collection("users").updateOne({ email }, { $set: { data: user.data } })
                    if (mongoResult.result.ok != 1) throw "Database unresponsive"
                    return user.data[type][list]
                } else {
                    throw "List does not exist"
                }
            } else {
                throw "No user"
            }
        } else {
            throw "Not allowed"
        }
    } else {
        throw "Not allowed"
    }
}

async function updateItem(id, newItem, list, type, email) {
    if (config.permissions[type].includes("w")) {
        if (config.allowedTypes.includes(type)) {
            let valid = true
            config.allowedFormats[type].forEach(x => {
                if (!(x in newItem)) {
                    valid = false
                }
            })
            if (config.allowedFormats[type].length != Object.keys(newItem).length) valid = false
            if (valid) {
                newItem.id = id
                let user = await getUserMongo(email)
                if (user) {
                    if (user.data[type][list]) {
                        let index = user.data[type][list].findIndex(x => x.id == id)
                        if (index > -1) {
                            user.data[type][list].splice(index, 1, newItem)
                            let mongoResult = await mongoDb.collection("users").updateOne({ email }, { $set: { data: user.data } })
                            if (mongoResult.result.ok != 1) throw "Database unresponsive"
                            return user.data[type][list]
                        } else {
                            throw "No task with id"
                        }
                    } else {
                        throw "List does not exist"
                    }
                } else {
                    throw "No user"
                }
            } else {
                throw "Not a valid object"
            }
        } else {
            throw "Not allowed"
        }
    } else {
        throw "Not allowed"
    }
}



// #endregion

module.exports = {
    getUserMongo,
    getMongoDB,

    addUserMongo,
    updateTokensMongo,

    getItem,
    addItem,
    deleteItem,
    updateItem,
}

