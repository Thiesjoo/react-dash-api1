module.exports = {
    // This is the JWT token secret
    secret: process.env.JWT_SECRET,
    mysqlPassword: process.env.DB_PASS,
    database_name: process.env.DB_NAME,
    saltRounds: 10,
    jwtExpiry: "15m",
    accessExpiry: 900000,
    refreshExpiry: 900000000
}