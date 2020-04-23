
module.exports = (app) => {
    app.get('/', (req, res) => {
        console.log("Get request on server. IP: ", req.ip)
        res.send({ ok: true, msg: "Hello world!" })
    })
}