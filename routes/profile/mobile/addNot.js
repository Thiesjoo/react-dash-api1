const config = require('../../../shared/config')


async function addNot (req, res)  {
    console.log(req.decoded)
    if (req.decoded.mobile) {
        //Add a notfication to user
        res.send({ok:true,amount:1})
    } else {
        res.send({ok:false, msg: config.errors.invalidToken})
    }
}

module.exports = addNot;