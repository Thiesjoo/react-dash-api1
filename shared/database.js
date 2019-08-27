const isDocker = require('is-docker');
const mysql = require('mysql');
const config = require('./config.js');

var ip = "localhost"
var isdocker = isDocker()
if (isdocker) {
    console.log("Is in docker")
    ip = "db"
}

var con = mysql.createConnection({
    host: ip,
    user: "nodejs",
    password: config.mysqlPassword,
    database: config.database_name
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to db! at ip", ip);
    var create = "create table if not exists users(id INT AUTO_INCREMENT PRIMARY KEY, email varchar(255), firstname varchar(255),lastname varchar(255),password varchar(255),token LONGTEXT, data LONGTEXT)"
    simpleQuery(create)
});

function simpleQuery(query) {
    //FIXME: Make promise and throw error
    con.query(query, function (err, result) {
        if (err) throw err;
    });
}


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

var database = new Database({
    host: ip,
    user: "nodejs",
    password: config.mysqlPassword,
    database: config.database_name
})


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
    return database.query("INSERT INTO users (email, firstname, lastname, password, token, data) VALUES (?,?,?,?,?, ?)", [email, firstname, lastname, password, JSON.stringify(token),JSON.stringify(data)])
        .then(result => {
            return result
        })
        .catch(error => {
            throw error
        })
}


function simpleQuery2(query, args = null) {
    return database.query(query, args)
        .then(result => {
            return result
        })
        .catch(error => {
            throw error
        })
}

module.exports = { con, simpleQuery, simpleQuery2, getUser,setUser }