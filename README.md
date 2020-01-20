# API1
##### By: Thies Nieborg, for: react-dash
To start the app ```node index.js```
The app get it's config from ```config.js``` which gets a few values from .env files or EXPORT.


## Docs
You can find the docs in `HTML` format in the folder: `docs/`
Use something like `serve docs/ -p 8080` to serve the folder

## Userdata structure

```
user
│   _id: userid
│   email: user@email.com    
│   password: hashed_password
|
└─── token
│   │
│   └───actual token
│       │   token: randomstring
│       │   useragent: useragent that the token was requested with
│       │   platform: platform that the token was requested with
│       │   expiry: expiry date of the token
│   
└───data
    │   
    └───items
    |
    └───tasks
    |   |
    |   └── taskList: name of the list
    |   |  | 
    |   |  └── task
    |   |     └── id
    |   |     └── title
    |   |     └── msg
    |   |     └── priority: 1-4
    |   |     └── child: boolean
    |   |     └── children: array of id's of children
    |
    └───banking
    |
    └───notifications
    |   |
    |   └── notification
    |       | 
    |       └── id
    |       └── color
    |       └── message
    |       └── type: info/warning/error
    |       └── created: Timestamp of creation
    |
    └───profile  
        |
        └── firstname
        └── lastname
        └── email
        └── emailVerified
```