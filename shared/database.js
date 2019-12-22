const isDocker = require('is-docker');
const mysql = require('mysql');
const config = require('./config.js');

// #region Config
let ip = "localhost"
let isdocker = isDocker()
if (isdocker) {
    console.log("Is in docker")
    ip = "db"
    console.log("Debugging info: ", ip, "nodejs", config)
}

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
//Get 1 item from list
async function getStuff(email, type) {
    if (config.allowedTypes.includes(type)) {
        let user = await getUser(email)
        if (user) {
            if (user.date[type]) {
                return JSON.parse(user.data[type])
            } else {
                throw "Not available"
            }
        } else {
            throw "No user"
        }
    } else {
        throw "Not allowed"
    }
}

//Add 1 item to list
async function addStuff(email, type, toadd, list) {
    if (config.allowedTypes.includes(type)) {
        let valid = true
        console.log(toadd)
        config.allowedFormats[type].forEach(x => {
            if (!(x in toadd)) {
                valid = false
            }
        })
        if (valid) {
            let user = await getUser(email)
            if (user) {
                let newtasks = JSON.parse(user.data)
                if (newtasks[type][list]) {
                    newtasks[type][list].push(toadd)
                    return database.query("UPDATE users SET data = ? WHERE email = ?", [JSON.stringify(newtasks), email])
                        .then(result => {
                            return newtasks[type]
                        })
                        .catch(error => {
                            throw error
                        })
                } else {
                    throw "No list"
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

//Changing 1 item in list
async function changeStuff(email, tochange, type, list, id) {
    if (config.allowedTypes.includes(type)) {
        let valid = true
        config.allowedFormats[type].forEach(x => {
            if (!(x in tochange)) {
                valid = false
            }
        })
        if (valid) {
            let user = await getUser(email)
            if (user) {
                let newtasks = JSON.parse(user.data)
                if (newstuff[type][list]) {
                    console.log(newstuff)
                    let index = newstuff[type][list].findIndex(x => x.id === id)
                    if (index > -1) {
                        newtasks[type][list].splice(index, 1, task)
                        return database.query("UPDATE users SET data = ? WHERE email = ?", [JSON.stringify(newtasks), email])
                            .then(result => {
                                return newtasks
                            })
                            .catch(error => {
                                throw error
                            })
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
}


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

async function deleteStuff(email, list, type, id) {
    if (config.allowedTypes.includes(type)) {
        let user = await getUser(email)
        if (user) {
            let newtasks = JSON.parse(user.data)
            if (newtasks[type][list]) {
                newtasks[type][list] = newtasks[type][list].filter(function (value, index) {
                    return value.id !== id
                });
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
        throw "Not allowed"
    }
}


async function deleteCat(email, list, type) {
    if (config.allowedTypes.includes(type)) {
        let user = await getUser(email)
        if (user) {
            let newtasks = JSON.parse(user.data)

            if (newtasks[type][list]) {
                //FIXME: WTF is happening here
                // let index = newtasks[type].findIndex(x => x.id === )
                let index = -1
                if (index > -1) {
                    newtasks.splice(index, 1)
                    return database.query("UPDATE users SET data = ? WHERE email = ?", [JSON.stringify(newtasks), email])
                        .then(result => {
                            return newtasks
                        })
                        .catch(error => {
                            throw error
                        })
                } else {
                    throw "Cat not found"
                }
            } else {
                throw "List does not exist"
            }
        } else {
            throw "No user"
        }
    } else {
        throw "Not allowed"
    }
}

async function addCat(email, type, list) {
    if (config.allowedTypes.includes(type)) {
        let user = await getUser(email)
        if (user) {
            let newtasks = JSON.parse(user.data)
            newtasks[type][list] = []
            return database.query("UPDATE users SET data = ? WHERE email = ?", [JSON.stringify(newtasks), email])
                .then(result => {
                    return newtasks
                })
                .catch(error => {
                    throw error
                })
        } else {
            throw "No user"
        }
    } else {
        throw "Not allowed"
    }
}

// #endregion


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

module.exports = {
    con,
    simpleQuery,

    //User
    getUser,
    setUser,

    //Generic
    getStuff,
    addStuff,
    changeStuff,
    changeStuffs,
    deleteStuff,
    addCat,
    deleteCat,
}