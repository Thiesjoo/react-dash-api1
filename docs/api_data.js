define({ "api": [
  {
    "type": "post",
    "url": "/errors/",
    "title": "Add a error to the api-errorlog",
    "name": "errors",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "errors",
            "description": "<p>Array with seperate error objects</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"ok\": true,\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/addError.js",
    "group": "/home/webadmin/react-dash-api1/src/routes/addError.js",
    "groupTitle": "/home/webadmin/react-dash-api1/src/routes/addError.js",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotEnoughInfo",
            "description": "<p>You do not meet the request's parameters.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "SomethingWentWrong",
            "description": "<p>Something went wrong with the server.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad request\n{\n  \"ok\": false,\n  \"msg\": \"There is not enough info\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal server error\n{\n  \"ok\": false,\n  \"msg\": \"Something went wrong\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/user/login",
    "title": "Log in to the api",
    "name": "login",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Users unique email.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Users password.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>All the data from the User.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"ok\": true,\n  \"data\": userData\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/login.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The id/email of the User was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "WrongPassword",
            "description": "<p>The password for this user is incorrect.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AccountDeletion",
            "description": "<p>The account was deleted and is now unavailable.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "RegexNotMatch",
            "description": "<p>The password or the email is not valid according to our rules.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotEnoughInfo",
            "description": "<p>You do not meet the request's parameters.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "SomethingWentWrong",
            "description": "<p>Something went wrong with the server.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"ok\": false,\n  \"msg\": \"Email/password combination in not correct\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"ok\": false,\n  \"msg\": \"Email/password combination in not correct\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"ok\": false,\n  \"msg\": \"This account was deleted and it is blocked due to user spoofing reasons\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad request\n{\n  \"ok\": false,\n  \"msg\": \"Invalid input\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad request\n{\n  \"ok\": false,\n  \"msg\": \"There is not enough info\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal server error\n{\n  \"ok\": false,\n  \"msg\": \"Something went wrong\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/user/signup",
    "title": "Signup to the api",
    "name": "signup",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Users unique email.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Users password.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstname",
            "description": "<p>Users first name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastname",
            "description": "<p>Users last name.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>All the data from the User.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"ok\": true,\n  \"data\": userData\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/signup.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AccountDeletion",
            "description": "<p>The account was deleted and is now unavailable.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "RegexNotMatch",
            "description": "<p>The password or the email is not valid according to our rules.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotEnoughInfo",
            "description": "<p>You do not meet the request's parameters.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "SomethingWentWrong",
            "description": "<p>Something went wrong with the server.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"ok\": false,\n  \"msg\": \"This account was deleted and it is blocked due to user spoofing reasons\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad request\n{\n  \"ok\": false,\n  \"msg\": \"Invalid input\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad request\n{\n  \"ok\": false,\n  \"msg\": \"There is not enough info\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal server error\n{\n  \"ok\": false,\n  \"msg\": \"Something went wrong\"\n}",
          "type": "json"
        }
      ]
    }
  }
] });
