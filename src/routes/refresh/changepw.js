const { getUserById,changePassword } = require("../../shared/database")
const config = require("../../shared/config")
const security = require("../../shared/security")

async function changePasswordFunc(req, res) {
    try {
        let body = req.body
        if (body.currentPassword && body.newPassword) {
            if (security.passwordRegex.test(body.currentPassword) && security.passwordRegex.test(body.newPassword)) {
                let refreshtoken = security.jwt.verify(req.cookies.refreshtoken, config.secret)
                let accesstoken = security.jwt.verify(req.cookies.accesstoken, config.secret)
                if (accesstoken && refreshtoken) {
                    let user = await getUserById(accesstoken.id)
                    if (user) {
                        let currentPasswordResult = await security.bcrypt.compare(body.currentPassword, user.password)
                        if (currentPasswordResult) {
                            let newHash = await security.bcrypt.hash(body.newPassword, security.saltRounds)

                            let result = await changePassword(newHash, accesstoken.id)
                            if (result.result.ok !== 1) throw "Database unresponsive"
                            res.send({ ok: true, msg: "Succesfully updated password" })
                        } else {
                            res.status(400).send({ ok: false, msg: config.errors.wrongPassword })
                        }
                    } else {
                         res.status(404).send({ ok: false, msg: config.errors.accountNotFound })
                    }
                } else {
                    res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
                }
            } else {
                res.status(400).send({ ok: false, msg: config.errors.regexNotMatch })
            }
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.error("\x1b[31m Changepw: ", error)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = changePasswordFunc