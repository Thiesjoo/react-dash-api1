const fetch = require('node-fetch');
const body = { firstname: "test", lastname: "test", email: "th1ies2003@gmail.com", password: "testA1", useragent: "accountTest", platform: "Node 12(LTS)" };

const login = false

const baseUrl = 'http://localhost:8090/'
const url = baseUrl + (login ? "user/login" : "user/signup")

for (var i = 0; i < 100; i++) {
    const newBody = { ...body }
    newBody.email = `${i}test@test.com`
    newBody.useragent = `${i}${body.useragent}`
    fetch(url, {
        method: 'post',
        body: JSON.stringify(newBody),
        headers: { 'Content-Type': 'application/json' },
    })
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(error => {
            console.error(error)
        })
}