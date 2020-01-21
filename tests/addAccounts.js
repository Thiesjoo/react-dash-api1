const fetch = require('node-fetch');
const body = { firstname: "test", lastname: "test", email: "th1ies2003@gmail.com", password: "testA1", useragent: "accountTest", platform: "Node 12(LTS)" };

const login = true

const baseUrl = 'http://localhost:8090/'
const url = baseUrl + (login ? "user/login" : "user/signup")

let promises = []

function main() {
    for (var i = 0; i < 10; i++) {
        const newBody = { ...body }
        let cookies = []
        newBody.email = `${i}test@test.com`
        newBody.useragent = `${i}${body.useragent}`
        promises.push(fetch(url, {
            method: 'POST',
            body: JSON.stringify(newBody),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => {
                cookies = res.headers.raw()['set-cookie']
                return res.json()
            })
            .then(json => {
                console.log(`Added user ${json.data.profile.firstname} with email: ${json.data.profile.email}`)
                if (json.ok) addItems(cookies)
            })
            .catch(error => {
                console.error(error)
            })
        )
    }
}

async function addItems(cookies) {
    try {
        for (var j = 0; j < 10; j++) {
            await fetch(baseUrl + "user/profile/item", {
                method: "POST",
                body: JSON.stringify({
                    item: {
                        msg: j + "_asdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjk",
                        title: j + "_asdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjkasdhakjsdhkjashdkjahskdjhajksdhakjsdhjktest",
                        children: [], priority: 1, child: false
                    },
                    type: "tasks",
                    list: "Your first list"
                }),
                headers: {
                    "Content-Type": "application/json",
                    "cookie": cookies.join(";")
                },
            })
            console.log("Added items")
        }
    } catch (error) {
        throw error
    }
}

(async () => {
    main()
    console.log("Sent out requets")
    await Promise.all(promises)
})()