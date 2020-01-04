const config = require('./config.js');



// #region MongoConfig
const mongoRequire = require('mongodb')
const mongoClient = mongoRequire.MongoClient;
const mongoUrl = config.mongoURL;
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
    try {
        return mongoDb.collection("users").findOne(mongoRequire.ObjectID(id))
    } catch (error) {
        throw error
    }
}

async function getUserByEmail(email) {
    try {
        return mongoDb.collection("users").findOne({ email })
    } catch (error) {
        throw error
    }
}

async function addUser(email, firstname, lastname, password, token) {
    try {
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

        let mongoResult = await mongoDb.collection("users").insertOne({ email, password, token, data: { items, tasks, notifications, profile: { firstname, lastname, email, emailVerified: false } } })
        return mongoResult.ops[0]
    } catch (error) {
        throw error
    }
}

async function updateTokens(id, newTokens) {
    try {
        return mongoDb.collection("users").updateOne({ _id: mongoRequire.ObjectID(id) }, { $set: { token: newTokens } })
    } catch (error) {
        throw error
    }
}

async function getItem(id, list, type, userId) {
    try {
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
    } catch (error) {
        throw error
    }
}


async function addItem(item, list, type, userId) {
    try {
        if (config.permissions[type] && config.permissions[type].includes("w")) {
            if (config.allowedTypes.includes(type)) {
                let valid = true
                config.allowedFormats[type].forEach(x => {
                    if (!(x in item)) {
                        valid = false
                    }
                })
                const differenceInLength = Math.abs(config.allowedFormats[type].length - Object.keys(item).length)
                if (differenceInLength > 1) valid = false
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
                        if (item.parentId) {
                            console.log("Adding item as subitem")
                            let parentIndex = user.data[type][list].findIndex(x => x.id == item.parentId)
                            if (parentIndex > -1) {
                                let parentItem = user.data[type][list][parentIndex]
                                parentItem.children.push(mongoRequire.ObjectID(item.id))
                                user.data[type][list].splice(parentIndex, 1, parentItem)
                            } else {
                                throw "Parent not found"
                            }
                            delete item.parentId
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
    } catch (error) {
        throw error
    }
}


async function deleteItem(id, list, type, userId) {
    try {
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
    } catch (error) {
        throw error
    }
}

async function updateItem(id, newItem, list, type, userId) {
    try {

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
    } catch (error) {
        throw error
    }
}

//neworder: [{id: _parentId, children: [childId]}] 
async function updateOrder(newOrder, list, type, userId) {
    try {

        if (config.permissions[type] && config.permissions[type].includes("w")) {
            if (config.allowedTypes.includes(type)) {
                let user = await getUserById(mongoRequire.ObjectID(userId))
                if (user) {
                    if (user.data[type][list]) {
                        let originalOrder = user.data[type][list]
                        originalOrder.forEach(x => {
                            x.child = false
                        })

                        let newList = []
                        //Find the original item and push it into the list. Do the same for sub items
                        newOrder.forEach(x => {
                            let itemIndex = originalOrder.findIndex(item => item.id == x.id)
                            if (itemIndex > -1) {
                                let item = originalOrder[itemIndex]
                                originalOrder.splice(itemIndex, 1)
                                if (x.children.length > 0) {
                                    x.children.forEach(y => {
                                        let alsoNewItemIndex = originalOrder.findIndex(item => item.id == y)
                                        if (alsoNewItemIndex > -1) {
                                            let alsoNewItem = originalOrder[alsoNewItemIndex]
                                            originalOrder.splice(alsoNewItemIndex, 1)
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
                        // FIXME: If you add items to the list and another user edit's the list: all added items gon
                        newList.concat(originalOrder)
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
    } catch (error) {
        throw error
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

