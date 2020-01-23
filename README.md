# API1
This is the REST api I made for my ```react-dash``` app. It includes logging in (With JWT-Tokens and bcrypt hashing), a CRUD interface and refreshtokens

## Getting started
To get this API running locally:

- Clone this repo
- `npm install` to install all required dependencies
- *If you dont have a mongodb this step is required* Install docker ([https://docs.docker.com/install/](https://docs.docker.com/install/)). This way you can easily fire up many instances of the same database
- `npm start` to start the local server(You have to specify the MongoURL). or `./dev_start.sh` on linux to start a docker container with mongodb


## ENV Variables

* MONGOURL=```url to your mongodb instance(Optional: leave empty to connect to localhost)``` 
* NODE_ENV=```production for more security, or dev for development```
* JWT_SECRET=```the secret that is used to encode the JWT-tokens```
* PORT=```the port where the application runs```


# Code Overview

## Structure
All files and folders in the `routes/` folder are automatically loaded and given the correct `url` and `method`. If you want to add something to this api, you can just add the file and you don't have to import anything.

## Docs
You can find the docs on [Github Pages](https://thiesjoo.github.io/react-dash-api1/) or host them yourself:
(They are in `HTML` format in the folder: `docs/` and you can use something like `serve docs/ -p 8080` to serve the folder)


## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [express-status-monitor](https://github.com/RafalWilinski/express-status-monitor) - For having a handy status page
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - For haashing the passwords of the users


## Authentication
When the user is logged in, the server hands out 2 cookies: `accesstoken` - valid for 15min and used to get data from the server, `refreshtoken` - valid for a week and used to retrieve new `accesstokens`

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

# Misc

## Author

* **Thies Nieborg** - *Initial work* - [Thiesjoo](https://github.com/Thiesjoo)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
