const Container = require("typedi").Container
const crudHelper = require("./crud")


const mongoRequire = require("mongodb")
const models = Container.get("models")
const UserModel = models.UserModel
const config = Container.get("config")
const mongoDb = Container.get("db")


// #region CRUD

async function getUserById(id) {
    return UserModel.findOne(mongoRequire.ObjectID(id))
}

async function getUserByEmail(email) {
    return UserModel.findOne({ email })
}

async function addUser(email, firstname, lastname, password, token) {
    let newUser = new UserModel({ email, password, token, data: { profile: { firstname, lastname, email } } })
    await newUser.save()
    return newUser
}

async function updateTokens(id, newTokens) {
    return UserModel.updateOne({ _id: mongoRequire.ObjectID(id) }, { $set: { token: newTokens } })
}


async function getItem(id, list, type, userId) {
    if (!config.permissions[type].includes("r")) throw new Error(config.errors.noPerms)
    let user = await getUserById(mongoRequire.ObjectID(userId))
    if (!user) throw new Error(config.errors.accountNotFound)
    if (user.data[type] && list !== undefined && user.data[type][list]) {
        let withId;

        if (id) withId = user.data[type][list].find(item => item.id == id)
        if (withId) return withId

        return user.data[type][list]
    } else if (user.data[type] && list == undefined) {
        return user.data[type]
    }
    return null
}


async function addItem(item, list, type, index, userId) {
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
                        if (getSize(user) < 10000000) { // 10 MB
                            if (user.data[type] && !user.data[type][list]) {
                                user.data[type][list] = []
                            } else if (!user.data[type]) {
                                user.data[type] = {}
                                user.data[type][list] = []
                            }
                            if (item.parentId) {
                                let parentIndex = user.data[type][list].findIndex(x => x.id == item.parentId)
                                if (parentIndex > -1) {
                                    let parentItem = user.data[type][list][parentIndex]
                                    parentItem.children.push(mongoRequire.ObjectID(item.id))
                                    user.data[type][list].splice(parentIndex, 1, parentItem)
                                } else {
                                    throw config.errors.invalidInfo
                                }
                                delete item.parentId
                            }
                            if (typeof index === "number" && index > -1 && index < user.data[type][list].length) {
                                user.data[type][list].splice(index, 0, item)
                            } else {
                                user.data[type][list].push(item)
                            }
                            let mongoResult = await mongoDb.collection("users").updateOne({ _id: mongoRequire.ObjectID(userId) }, { $set: { data: user.data } })
                            if (mongoResult.result.ok != 1) throw config.errors.general
                            return user.data[type][list]
                        } else {
                            throw config.errors.tooMuchSpace
                        }
                    } else {
                        throw config.errors.accountNotFound
                    }
                } else {
                    throw config.errors.invalidInfo
                }
            } else {
                throw config.errors.noPerms
            }
        } else {
            throw config.errors.noPerms
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
                        if (mongoResult.result.ok != 1) throw config.errors.general
                        return user.data[type][list]
                    } else {
                        throw config.errors.notFound
                    }
                } else {
                    throw config.errors.accountNotFound
                }
            } else {
                throw config.errors.noPerms
            }
        } else {
            throw config.errors.noPerms
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
                                if (mongoResult.result.ok != 1) throw config.errors.general
                                return user.data[type][list]
                            } else {
                                throw config.errors.notFound
                            }
                        } else {
                            throw config.errors.notFound
                        }
                    } else {
                        throw config.errors.accountNotFound
                    }
                } else {
                    throw config.errors.invalidInfo
                }
            } else {
                throw config.errors.noPerms
            }
        } else {
            throw config.errors.noPerms
        }
    } catch (error) {
        throw error
    }
}

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
                        //Find the original item and push it into a new list(In order). Do the same for sub items
                        newOrder.forEach(parentItem => {
                            let parentItemIndex = originalOrder.findIndex(item => item.id == parentItem.id)
                            if (parentItemIndex > -1) {
                                let originalItem = originalOrder[parentItemIndex]
                                originalOrder.splice(parentItemIndex, 1)
                                if (parentItem.children) {
                                    if (parentItem.children.length > 0) {
                                        parentItem.children.forEach(y => {
                                            let childItemIndex = originalOrder.findIndex(item => item.id == y)
                                            if (y === "temp") {
                                                return
                                            } else if (childItemIndex > -1) {
                                                let childItem = originalOrder[childItemIndex]
                                                originalOrder.splice(childItemIndex, 1)
                                                childItem.child = true
                                                newList.push(childItem)
                                            } else {
                                                throw config.errors.invalidInfo
                                            }
                                        })
                                    }
                                    originalItem.children = parentItem.children
                                } else {
                                    originalItem.children = [] //Always reset children
                                }
                                newList.push(originalItem)
                            } else {
                                throw config.errors.invalidInfo
                            }
                        })
                        const finalList = newList.concat(originalOrder) //If you only submit half the list it still adds the rest to the end
                        user.data[type][list] = finalList
                        let mongoResult = await mongoDb.collection("users").updateOne({ _id: mongoRequire.ObjectID(userId) }, { $set: { data: user.data } })
                        if (mongoResult.result.ok != 1) throw config.errors.general
                        return user.data
                    } else {
                        throw config.errors.notFound
                    }
                } else {
                    throw config.errors.accountNotFound
                }
            } else {
                throw config.errors.noPerms
            }
        } else {
            throw config.errors.noPerms
        }
    } catch (error) {
        throw error
    }
}

async function deleteList(list, type, userId) {
    try {
        if (config.permissions[type].includes("w")) {
            let user = await getUserById(mongoRequire.ObjectID(userId))
            if (user) {
                if (user.data[type] && user.data[type][list]) {
                    delete user.data[type][list]
                    //For every location
                    Object.keys(user.data.items).forEach(x => {
                        console.log(x, user.data.items, user.data.items[x])
                        //For every type
                        user.data.items[x].forEach((y, index) => {
                            //Filter the deleted list
                            user.data.items[x][index].options = y.options.filter(item => item !== list)
                        })
                        // [x] accesses the location object("home") and [0] gets the array of items that is stored
                        //FIXME: Fix this!
                        // user.data.items[x][0].options = user.data.items[x][0].options.filter(item => item === list)
                    })
                    let mongoResult = await mongoDb.collection("users").updateOne({ _id: mongoRequire.ObjectID(userId) }, { $set: { data: user.data } })
                    if (mongoResult.result.ok != 1) throw config.errors.general
                    return user.data
                } else {
                    throw config.errors.notFound
                }
            } else {
                throw config.errors.accountNotFound
            }
        } else {
            throw config.errors.noPerms
        }
    } catch (error) {
        throw error
    }
}


async function deleteAccount(id, email) {
    try {
        return mongoDb.collection("users").replaceOne({ _id: mongoRequire.ObjectID(id) }, { email, password: "", timeOfDeletion: Date.now() })
    } catch (error) {
        throw error
    }
}

async function changePassword(hash, id) {
    try {
        return mongoDb.collection("users").updateOne({ _id: mongoRequire.ObjectID(id) }, { $set: { password: hash } })
    } catch (error) {
        throw error
    }
}

// #endregion


// #region Helper functions

function getSize(object) {
    return lengthInUtf8Bytes(JSON.stringify(object))
}

function lengthInUtf8Bytes(str) {
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    let m = encodeURIComponent(str).match(/%[89ABab]/g);
    return str.length + (m ? m.length : 0);
}

function bytesToSize(a, b) { if (0 == a) return "0 Bytes"; let c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }

// #endregion

module.exports = {
    getUserById,
    getUserByEmail,

    addUser,
    updateTokens,
    deleteAccount,
    changePassword,

    getItem,
    addItem,
    deleteItem,
    updateItem,
    updateOrder,
    deleteList
}

