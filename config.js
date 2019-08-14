module.exports = {
    // This is the JWT token secret
    secret: process.env.JWT_SECRET,
    mysqlPassword: process.env.DB_PASS,
    saltRounds: 10,
    jwtExpiry: "15m",
    accessExpiry: 900000,
    refreshExpiry: 900000000
}