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

async function getUserById(id) {
    return mongoDb.collection("users").findOne(mongoRequire.ObjectID(id))
}

async function getUserByEmail(email) {
    return mongoDb.collection("users").findOne({ email })
}


async function addUser(email, firstname, lastname, password, token) {
    const notifications = [
        { id: new mongoRequire.ObjectID(), color: "warning", message: "Your email is not verified yet", type: "info", created: new Date() },
    ]
    const tempId = new mongoRequire.ObjectID()
    const tasks = {
        "Your first list": [
            {
                id: new mongoRequire.ObjectID(),
                title: "Verify your email",
                msg: "You can just click the link that has been sent to you",
                priority: 4,
                children: [tempId],
                child: false
            },
            {
                id: tempId,
                title: "Sub item test",
                msg: "You can just click the link that has been sent to you",
                priority: 4,
                children: [],
                child: true
            }
        ]
    }
    const items = {
        home: [{ name: "tasks", options: { list: "Your first list" } }]
    }

    return mongoDb.collection("users").insertOne({ email, password, token, data: { items, tasks, notifications, profile: { firstname, lastname, email, emailVerified: false } } })
}

async function updateTokens(id, newTokens) {
    return mongoDb.collection("users").updateOne({ _id: mongoRequire.ObjectID(id) }, { $set: { token: newTokens } })
}

async function getItem(id, list, type, userId) {
    if (config.permissions[type].includes("r")) {
        let user = await getUserById(mongoRequire.ObjectID(userId))
        if (user) {
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


async function addItem(item, list, type, userId) {
    if (config.permissions[type] && config.permissions[type].includes("w")) {
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
                let user = await getUserById(mongoRequire.ObjectID(userId))
                if (user) {
                    if (user.data[type] && !user.data[type][list]) {
                        user.data[type][list] = []
                    } else if (!user.data[type]) {
                        user.data[type] = {}
                        user.data[type][list] = []
                    }
                    user.data[type][list].push(item)
                    let mongoResult = await mongoDb.collection("users").updateOne({ _id: mongoRequire.ObjectID(userId) }, { $set: { data: user.data } })
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


async function deleteItem(id, list, type, userId) {
    if (config.permissions[type] && config.permissions[type].includes("w")) {
        if (config.allowedTypes.includes(type)) {
            let user = await getUserById(mongoRequire.ObjectID(userId))
            if (user) {
                if (user.data[type][list]) {
                    user.data[type][list] = user.data[type][list].filter(function (value, index) {
                        return value.id != id
                    });
                    let mongoResult = await mongoDb.collection("users").updateOne({ _id: mongoRequire.ObjectID(userId) }, { $set: { data: user.data } })
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

async function updateItem(id, newItem, list, type, userId) {
    if (config.permissions[type] && config.permissions[type].includes("w")) {
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
                let user = await getUserById(mongoRequire.ObjectID(userId))
                if (user) {
                    if (user.data[type][list]) {
                        let index = user.data[type][list].findIndex(x => x.id == id)
                        if (index > -1) {
                            user.data[type][list].splice(index, 1, newItem)
                            let mongoResult = await mongoDb.collection("users").updateOne({ _id: mongoRequire.ObjectID(userId) }, { $set: { data: user.data } })
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

//neworder: [{id: _parentId, children: [childId]}] 
async function updateOrder(newOrder, list, type, userId) {
    if (config.permissions[type] && config.permissions[type].includes("w")) {
        if (config.allowedTypes.includes(type)) {
            let user = await getUserById(mongoRequire.ObjectID(userId))
            if (user) {
                if (user.data[type][list]) {
                    let originalOrder = user.data[type][list]
                    originalOrder.forEach(x=> {
                        x.child = false
                    })

                    let newList = []
                    //Find the original item and push it into the list. Do the same for sub items
                    newOrder.forEach(x => {
                        let item = originalOrder.find(item => item.id == x.id)
                        if (item) {
                            if (x.children.length > 0) {
                                x.children.forEach(y => {
                                    let alsoNewItem = originalOrder.find(item => item.id == y)
                                    if (alsoNewItem) {
                                        alsoNewItem.child = true
                                        newList.push(alsoNewItem)
                                    } else {
                                        throw "Invalid sub-id given"
                                    }
                                })
                            }
                            item.children = x.children
                            newList.push(item)
                        } else {
                            throw "Invalid id given"
                        }
                    })
                    user.data[type][list] = newList
                    let mongoResult = await mongoDb.collection("users").updateOne({ _id: mongoRequire.ObjectID(userId) }, { $set: { data: user.data } })
                    if (mongoResult.result.ok != 1) throw "Database unresponsive"
                    return newList
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

// #endregion

module.exports = {
    getUserById,
    getUserByEmail,
    getMongoDB,

    addUser,
    updateTokens,

    getItem,
    addItem,
    deleteItem,
    updateItem,
    updateOrder
}

