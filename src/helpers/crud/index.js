const uuid = require("uuid").v4


function generateUser() {
    const notifications = [
        { id: uuid(), color: "warning", message: "Your email is not verified yet", type: "info", created: new Date() },
    ]
    const tempTaskId = uuid()
    const tasks = {
        "Your first list": [
            {
                id: uuid(),
                title: "Verify your email",
                msg: "You can just click the link that has been sent to you",
                priority: 4,
                children: [tempTaskId],
                child: false
            },
            {
                id: tempTaskId,
                title: "Sub item test",
                msg: "You can just click the link that has been sent to you",
                priority: 4,
                children: [],
                child: true
            }
        ]
    }
    const items = {
        home: [{ type: "tasks", options: ["Your first list"], id: uuid() }]
    }
    return { items, notifications, tasks }
}

module.exports = { generateUser }