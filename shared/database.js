const isDocker = require('is-docker');
const mysql = require('mysql');
const config = require('./config.js');

let ip = "localhost"
let isdocker = isDocker()
if (isdocker) {
    console.log("Is in docker")
    ip = "db"
    console.log("Debugging info: ", config)
}

// #region MysqlConfig

let con = mysql.createConnection({
    host: ip,
    user: "nodejs",
    password: config.mysqlPassword,
    database: config.database_name
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to db! at ip", ip);
    let create = "create table if not exists users(id INT AUTO_INCREMENT PRIMARY KEY, email varchar(255), firstname varchar(255), lastname varchar(255), password varchar(255), token LONGTEXT, data LONGTEXT)"
    simpleQuery(create)
});

class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
}

let database = new Database({
    host: ip,
    user: "nodejs",
    password: config.mysqlPassword,
    database: config.database_name
})

function simpleQuery(query, args = null) {
    return database.query(query, args)
        .then(result => {
            return result
        })
        .catch(error => {
            throw error
            process.exit()
        })
}

// #endregion

// #region MongoConfig
const mongoRequire = require('mongodb')
const mongoClient = mongoRequire.MongoClient;
const mongoUrl = 'mongodb://localhost:27017/';
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



// #region User
async function getUser(email) {
    return database.query("SELECT * FROM users WHERE email = ?", [email])
        .then(result => {
            if (result.length > 1) {
                throw "More then 1 email adress found."
            }
            return result[0]
        })
        .catch(error => {
            throw error
        })
}

async function setUser(email, firstname, lastname, password, token, data) {
    return database.query("INSERT INTO users (email, firstname, lastname, password, token, data) VALUES (?,?,?,?,?,?)", [email, firstname, lastname, password, JSON.stringify(token), JSON.stringify(data)])
        .then(result => {
            return result
        })
        .catch(error => {
            throw error
        })
}

// #endregion

// #region CRUD

//Changing entire list
async function changeStuffs(email, type, tochange, list) {
    if (config.allowedTypes.includes(type)) {
        let valid = true
        tochange.forEach(y => {
            config.allowedFormats[type].forEach(x => {
                if (!(x in y)) {
                    valid = false
                }
            })
        })
        if (valid) {
            let user = await getUser(email)
            if (user) {
                let newtasks = JSON.parse(user.data)
                if (newtasks[type][list]) {
                    newtasks[type][list] = tochange
                    return database.query("UPDATE users SET data = ? WHERE email = ?", [JSON.stringify(newtasks), email])
                        .then(result => {
                            return newtasks
                        })
                        .catch(error => {
                            throw error
                        })
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
}

// #endregion

// #region CRUD MONGO

function getMongoDB() {
    return mongoDb
}

async function getUserMongo(email) {
    return mongoDb.collection("users").findOne({ email })
}

async function addUserMongo(email, firstname, lastname, password, token) {
    return mongoDb.collection("users").insertOne({ email, password, token, data: { profile: { firstname, lastname, emailVerified: false } } })
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



    con,
    simpleQuery,

    //User
    getUser,
    setUser,

    //Generic

    changeStuffs,

}

