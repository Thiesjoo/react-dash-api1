const config = require('../../../shared/config')
const { getUser } = require("../../../shared/database")


async function addNot(req, res) {
    try {
        let valid = true
        config.allowedFormats["notification"].forEach(x => {
            if (!(x in req.body)) {
                valid = false
            }
        })
        if (!req.body.category) {
            valid = false
        }
        if (valid) {

            console.log("adding notfication with : ", req.body.email, req.body.token)
            let user = await getUser(req.body.email)
            if (user) {
                let tokens = JSON.parse(user.token)
                valid = false
                for (let element of tokens) {
                    if (element.platform == "mobile") {
                        if (req.body.token == element.token) {
                            valid = true
                            break
                        }
                    }
                }
                if (valid) {
//Check if category exists (If not make one), Should be phonename 
//Add the item to the category

                    res.send({ ok: true, amount: 1 })
                } else {
                    console.log("Invalid token")
                    return res.status(401).send({
                        ok: false,
                        message: config.errors.invalidToken,
                    });
                }
            } else {
                console.log("User not found")
                res.status(400).send({ ok: false, msg: config.errors.accountNotFound })
            }
        } else {
            res.status(400).send({ ok: false, msg: config.errors.notEnoughInfo })
        }
    } catch (error) {
        console.log("error", error)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}

module.exports = addNot;