const { getUserById, deleteAccount } = require("../../shared/database")
const config = require("../../shared/config")
const security = require("../../shared/security")

async function deleteAccountFunction(req, res) {
    try {
        let body = req.body
        if (body.password) {
            if (security.passwordRegex.test(body.password)) {
                let refreshtoken = security.jwt.verify(req.cookies.refreshtoken, config.secret)
                let accesstoken = security.jwt.verify(req.cookies.accesstoken, config.secret)

                if (accesstoken && refreshtoken) {
                    let user = await getUserById(accesstoken.id)
                    if (user) {
                        let passwordResult = await security.bcrypt.compare(body.password, user.password)
                        if (passwordResult) {
                            let databaseResult = await deleteAccount(accesstoken.id, accesstoken.email)
                            let result = databaseResult.result
                            if (result.ok === 1) {
                                res.send({ ok: true })
                            } else {
                                throw "Database unresponsive"
                                // res.send({ ok: false, msg: config.errors.da })
                            }
                        } else {
                            res.status(401).send({ ok: false, msg: config.errors.wrongPassword })
                        }
                    } else {
                        res.status(400).send({ ok: false, msg: config.errors.accountNotFound })
                    }
                } else {
                    res.status(401).send({ ok: false, msg: config.errors.noRefresh })
                }
            } else {
                res.status(400).send({ ok: false, msg: config.errors.regexNotMatch })
            }
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.error("\x1b[31m deleteAccount: ", error, req.body)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = deleteAccountFunction