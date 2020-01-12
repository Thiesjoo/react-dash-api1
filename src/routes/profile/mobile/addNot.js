const config = require('../../../shared/config')
const { getUserById } = require("../../../shared/database")


async function addNot(req, res) {
    try {
        let formatValid = true
        config.allowedFormats["notification"].forEach(x => {
            if (!(x in req.body)) {
                formatValid = false
            }
        })
        if (!req.body.category) {
            formatValid = false
        }
        if (formatValid) {
            let user = await getUserById(req.decoded.id)
            if (user) {
                let tokens = user.token
                formatValid = false
                for (let element of tokens) {
                    if (element.platform == "mobile") {
                        if (req.body.token == element.token) {
                            formatValid = true
                            break
                        }
                    }
                }
                if (formatValid) {

                    res.send({ ok: true, amount: 1 })
                } else {
                    return res.status(401).send({
                        ok: false,
                        message: config.errors.invalidToken,
                    });
                }
            } else {
                 res.status(404).send({ ok: false, msg: config.errors.accountNotFound })
            }
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.error("\x1b[31m addNotError", error, req.body)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = addNot;