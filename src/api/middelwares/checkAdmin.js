module.exports = async (req, res, next) => {
    try {
        const user = await getUserById(req.decoded.id)
        if (user && user.admin) {
            next()
        } else {
            return res.status(401).send({ ok: false, msg: config.errors.noPerms })
        }
    } catch (err) {
        console.error("\x1b[31m checkAdmin: ", err)
        res.status(500).send({ ok: false, msg: config.errors.general })
    }
}