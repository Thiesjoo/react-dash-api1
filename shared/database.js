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
    var create = "create table if not exists users(id INT AUTO_INCREMENT PRIMARY KEY, email varchar(255), firstname varchar(255),lastname varchar(255),password varchar(255),token LONGTEXT)"
    simpleQuery(create)
});

function simpleQuery(query) {
    con.query(query, function (err, result) {
        if (err) throw err;
    });
}

module.exports = { con: con, simpleQuery: simpleQuery }