define({ "api": [
  {
    "type": "post",
    "url": "/user/profile/item",
    "title": "Add item",
    "description": "<p>All errors are returned with http code 500, due to a limitation with the database. GET requests use PARAMS and the rest uses the request BODY</p>",
    "name": "addItem",
    "group": "CRUD",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:accesstoken",
            "description": "<p>Users unique access-token.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "item",
            "description": "<p>Item to add. Has to comply with config of type</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "list",
            "description": "<p>The list to add the item to</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Category of the item(tasks, banking and notifications)</p>"
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
            "description": "<p>All the data from the requested list(From type).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"ok\": true,\n  \"result\": (result)\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/profile/crud/addItem.js",
    "groupTitle": "CRUD",
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
            "field": "InvalidInfo",
            "description": "<p>You do not meet the request's parameters.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotEnoughPermissions",
            "description": "<p>Not enough permissions to do this action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotEnoughInfo",
            "description": "<p>You do not meet the request's parameters.</p>"
          }
        ],
        "500 Internal Server Error": [
          {
            "group": "500 Internal Server Error",
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
          "content": "HTTP/1.1 400 Bad request\n{\n  \"ok\": false,\n  \"msg\": \"Invalid input\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"ok\": false,\n  \"msg\": \"Not enough permissions to do this action\"\n}",
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
    "type": "delete",
    "url": "/user/profile/item",
    "title": "Delete item",
    "description": "<p>All errors are returned with http code 500, due to a limitation with the database. GET requests use PARAMS and the rest uses the request BODY</p>",
    "name": "deleteItem",
    "group": "CRUD",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:accesstoken",
            "description": "<p>Users unique access-token.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of item to delete</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "list",
            "description": "<p>List of the item</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Category of the item(tasks, banking and notifications )</p>"
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
            "description": "<p>All the data from the requested list(From type).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"ok\": true,\n  \"result\": (result)\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/profile/crud/deleteItem.js",
    "groupTitle": "CRUD",
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
            "field": "InvalidInfo",
            "description": "<p>You do not meet the request's parameters.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotEnoughPermissions",
            "description": "<p>Not enough permissions to do this action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotEnoughInfo",
            "description": "<p>You do not meet the request's parameters.</p>"
          }
        ],
        "500 Internal Server Error": [
          {
            "group": "500 Internal Server Error",
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
          "content": "HTTP/1.1 400 Bad request\n{\n  \"ok\": false,\n  \"msg\": \"Invalid input\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"ok\": false,\n  \"msg\": \"Not enough permissions to do this action\"\n}",
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
    "type": "delete",
    "url": "/user/profile/items",
    "title": "Delete a list",
    "description": "<p>All errors are returned with http code 500, due to a limitation with the database. GET requests use PARAMS and the rest uses the request BODY</p>",
    "name": "deleteList",
    "group": "CRUD",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:accesstoken",
            "description": "<p>Users unique access-token.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "list",
            "description": "<p>The list to delete</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Category of the item(tasks, banking and notifications)</p>"
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
            "description": "<p>All the data from the user.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"ok\": true,\n  \"result\": (result)\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/profile/crudList/deleteList.js",
    "groupTitle": "CRUD",
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
            "field": "InvalidInfo",
            "description": "<p>You do not meet the request's parameters.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotEnoughPermissions",
            "description": "<p>Not enough permissions to do this action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotEnoughInfo",
            "description": "<p>You do not meet the request's parameters.</p>"
          }
        ],
        "500 Internal Server Error": [
          {
            "group": "500 Internal Server Error",
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
          "content": "HTTP/1.1 400 Bad request\n{\n  \"ok\": false,\n  \"msg\": \"Invalid input\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"ok\": false,\n  \"msg\": \"Not enough permissions to do this action\"\n}",
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
    "type": "get",
    "url": "/user/profile/item",
    "title": "Get item",
    "description": "<p>All errors are returned with http code 500, due to a limitation with the database. GET requests use PARAMS and the rest uses the request BODY</p>",
    "name": "getItem",
    "group": "CRUD",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:accesstoken",
            "description": "<p>Users unique access-token.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "list",
            "description": "<p><em>Optional</em> When not specified gather all data from specified type else: The list of items</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p><em>Optional</em> When not specified gather all data else: Category of the item(tasks, banking and notifications)</p>"
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
            "description": "<p>All the data from the requested list(From type).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"ok\": true,\n  \"result\": (result)\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/profile/crud/getItem.js",
    "groupTitle": "CRUD",
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
            "field": "InvalidInfo",
            "description": "<p>You do not meet the request's parameters.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotEnoughPermissions",
            "description": "<p>Not enough permissions to do this action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotEnoughInfo",
            "description": "<p>You do not meet the request's parameters.</p>"
          }
        ],
        "500 Internal Server Error": [
          {
            "group": "500 Internal Server Error",
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
          "content": "HTTP/1.1 400 Bad request\n{\n  \"ok\": false,\n  \"msg\": \"Invalid input\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"ok\": false,\n  \"msg\": \"Not enough permissions to do this action\"\n}",
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
    "type": "put",
    "url": "/user/profile/item",
    "title": "Update item",
    "description": "<p>All errors are returned with http code 500, due to a limitation with the database. GET requests use PARAMS and the rest uses the request BODY</p>",
    "name": "updateItem",
    "group": "CRUD",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:accesstoken",
            "description": "<p>Users unique access-token.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "item",
            "description": "<p>Updated item. Has to comply with config of type</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Id of the item to add.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "list",
            "description": "<p>The list to add the item to</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Category of the item(tasks, banking and notifications)</p>"
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
            "description": "<p>All the data from the requested list(From type).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"ok\": true,\n  \"result\": (result)\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/profile/crud/updateItem.js",
    "groupTitle": "CRUD",
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
            "field": "InvalidInfo",
            "description": "<p>You do not meet the request's parameters.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotEnoughPermissions",
            "description": "<p>Not enough permissions to do this action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotEnoughInfo",
            "description": "<p>You do not meet the request's parameters.</p>"
          }
        ],
        "500 Internal Server Error": [
          {
            "group": "500 Internal Server Error",
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
          "content": "HTTP/1.1 400 Bad request\n{\n  \"ok\": false,\n  \"msg\": \"Invalid input\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"ok\": false,\n  \"msg\": \"Not enough permissions to do this action\"\n}",
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
    "type": "patch",
    "url": "/user/profile/items",
    "title": "Update order of items",
    "description": "<p>All errors are returned with http code 500, due to a limitation with the database. GET requests use PARAMS and the rest uses the request BODY</p>",
    "name": "updateOrder",
    "group": "CRUD",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:accesstoken",
            "description": "<p>Users unique access-token.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "item",
            "description": "<p>List of the order of items. Format: [{id: (item_id), children: [(item_id)]}]</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "list",
            "description": "<p>The list to add the item to</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Category of the item(tasks, banking and notifications)</p>"
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
            "description": "<p>All the data from the requested list(From type).</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"ok\": true,\n  \"result\": (result)\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/profile/crudList/updateOrder.js",
    "groupTitle": "CRUD",
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
            "field": "InvalidInfo",
            "description": "<p>You do not meet the request's parameters.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotEnoughPermissions",
            "description": "<p>Not enough permissions to do this action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotEnoughInfo",
            "description": "<p>You do not meet the request's parameters.</p>"
          }
        ],
        "500 Internal Server Error": [
          {
            "group": "500 Internal Server Error",
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
          "content": "HTTP/1.1 400 Bad request\n{\n  \"ok\": false,\n  \"msg\": \"Invalid input\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"ok\": false,\n  \"msg\": \"Not enough permissions to do this action\"\n}",
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
    "type": "get",
    "url": "/status",
    "title": "Return a webpage with app status",
    "name": "Stats",
    "permission": [
      {
        "name": "admin",
        "title": "Admin users access only",
        "description": "<p>You can only become an admin in a DEV environment or by changing the database</p>"
      }
    ],
    "group": "Monitoring",
    "version": "0.0.0",
    "filename": "src/index.js",
    "groupTitle": "Monitoring"
  },
  {
    "type": "post",
    "url": "/errors/",
    "title": "Add a error to the errorlog",
    "name": "errors",
    "group": "Monitoring",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:accesstoken",
            "description": "<p>Users unique access-token.</p>"
          }
        ]
      }
    },
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
    "groupTitle": "Monitoring",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotEnoughInfo",
            "description": "<p>You do not meet the request's parameters.</p>"
          }
        ],
        "500 Internal Server Error": [
          {
            "group": "500 Internal Server Error",
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
          "content": "HTTP/1.1 200 OK\nJSON: {\n  \"ok\": true,\n  \"data\": userData\n}\nCookie: {\n     accesstoken,\n     refreshtoken\n}",
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
          }
        ],
        "500 Internal Server Error": [
          {
            "group": "500 Internal Server Error",
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
          "content": "HTTP/1.1 200 OK\nJSON: {\n  \"ok\": true,\n  \"data\": userData\n}\nCookie: {\n     accesstoken,\n     refreshtoken\n}",
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
          }
        ],
        "500 Internal Server Error": [
          {
            "group": "500 Internal Server Error",
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
  },
  {
    "type": "get",
    "url": "/",
    "title": "Returns a simple JSON message with \"Hello world!\"",
    "name": "home",
    "group": "public",
    "version": "0.0.0",
    "filename": "src/index.js",
    "groupTitle": "Public",
    "groupDescription": "<p>Routes accessible for everyone</p>"
  },
  {
    "type": "post",
    "url": "/user/refresh/changePW",
    "title": "Change password for a user",
    "name": "changePW",
    "group": "refresh",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:accesstoken",
            "description": "<p>Users unique access-token.</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:refreshtoken",
            "description": "<p>Users unique refresh-token.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
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
            "field": "newPassword",
            "description": "<p>Users password.</p>"
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
    "filename": "src/routes/refresh/changepw.js",
    "groupTitle": "Refresh routes",
    "groupDescription": "<p>Routes where you need your refresh-token</p>",
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
            "field": "InvalidToken",
            "description": "<p>Your token is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoRefresh",
            "description": "<p>Refresh token is not there</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "WrongPassword",
            "description": "<p>The password for this user is incorrect.</p>"
          }
        ],
        "500 Internal Server Error": [
          {
            "group": "500 Internal Server Error",
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
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"ok\": false,\n  \"msg\": \"Your token is invalid\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal server error\n{\n  \"ok\": false,\n  \"msg\": \"Refresh token not present\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"ok\": false,\n  \"msg\": \"Email/password combination in not correct\"\n}",
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
    "url": "/user/refresh/deleteAccount",
    "title": "Delete a user's account",
    "name": "deleteAccount",
    "group": "refresh",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:accesstoken",
            "description": "<p>Users unique access-token.</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:refreshtoken",
            "description": "<p>Users unique refresh-token.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
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
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"ok\": true,\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/refresh/deleteAccount.js",
    "groupTitle": "Refresh routes",
    "groupDescription": "<p>Routes where you need your refresh-token</p>",
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
            "field": "InvalidToken",
            "description": "<p>Your token is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoRefresh",
            "description": "<p>Refresh token is not there</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "WrongPassword",
            "description": "<p>The password for this user is incorrect.</p>"
          }
        ],
        "500 Internal Server Error": [
          {
            "group": "500 Internal Server Error",
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
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"ok\": false,\n  \"msg\": \"Your token is invalid\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal server error\n{\n  \"ok\": false,\n  \"msg\": \"Refresh token not present\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"ok\": false,\n  \"msg\": \"Email/password combination in not correct\"\n}",
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
    "url": "/user/refresh/deleteRefresh",
    "title": "Revoke one or more refresh tokens",
    "name": "deleteRefresh",
    "group": "refresh",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:accesstoken",
            "description": "<p>Users unique access-token.</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:refreshtoken",
            "description": "<p>Users unique refresh-token.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"ok\": true,\n  \"tokens\": (User's tokens)\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/refresh/deleteRefresh.js",
    "groupTitle": "Refresh routes",
    "groupDescription": "<p>Routes where you need your refresh-token</p>",
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
            "field": "NotEnoughInfo",
            "description": "<p>You do not meet the request's parameters.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidToken",
            "description": "<p>Your token is invalid</p>"
          }
        ],
        "500 Internal Server Error": [
          {
            "group": "500 Internal Server Error",
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
          "content": "HTTP/1.1 400 Bad request\n{\n  \"ok\": false,\n  \"msg\": \"There is not enough info\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"ok\": false,\n  \"msg\": \"Your token is invalid\"\n}",
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
    "url": "/user/refresh/generateExtra",
    "title": "Generate a mobile token",
    "name": "generateExtra",
    "group": "refresh",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:accesstoken",
            "description": "<p>Users unique access-token.</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:refreshtoken",
            "description": "<p>Users unique refresh-token.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"ok\": true,\n  \"token\": (A new refreshtoken)\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/refresh/generateExtra.js",
    "groupTitle": "Refresh routes",
    "groupDescription": "<p>Routes where you need your refresh-token</p>",
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
            "field": "NotEnoughInfo",
            "description": "<p>You do not meet the request's parameters.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidToken",
            "description": "<p>Your token is invalid</p>"
          }
        ],
        "500 Internal Server Error": [
          {
            "group": "500 Internal Server Error",
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
          "content": "HTTP/1.1 400 Bad request\n{\n  \"ok\": false,\n  \"msg\": \"There is not enough info\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"ok\": false,\n  \"msg\": \"Your token is invalid\"\n}",
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
    "url": "/user/refresh/getRefresh",
    "title": "Get data about your refresh tokens",
    "name": "getRefresh",
    "group": "refresh",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:accesstoken",
            "description": "<p>Users unique access-token.</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:refreshtoken",
            "description": "<p>Users unique refresh-token.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"ok\": true,\n  \"tokens\": (User's tokens)\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/refresh/getRefresh.js",
    "groupTitle": "Refresh routes",
    "groupDescription": "<p>Routes where you need your refresh-token</p>",
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
            "field": "NotEnoughInfo",
            "description": "<p>You do not meet the request's parameters.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidToken",
            "description": "<p>Your token is invalid</p>"
          }
        ],
        "500 Internal Server Error": [
          {
            "group": "500 Internal Server Error",
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
          "content": "HTTP/1.1 400 Bad request\n{\n  \"ok\": false,\n  \"msg\": \"There is not enough info\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"ok\": false,\n  \"msg\": \"Your token is invalid\"\n}",
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
    "url": "/user/refresh/logout",
    "title": "Log the user out(Delete token from database)",
    "name": "logout",
    "group": "refresh",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:accesstoken",
            "description": "<p>Users unique access-token.</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:refreshtoken",
            "description": "<p>Users unique refresh-token.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Users unique email.</p>"
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
    "filename": "src/routes/refresh/logout.js",
    "groupTitle": "Refresh routes",
    "groupDescription": "<p>Routes where you need your refresh-token</p>",
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
            "field": "InvalidToken",
            "description": "<p>Your token is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotEnoughPermissions",
            "description": "<p>Not enough permissions to do this action</p>"
          }
        ],
        "500 Internal Server Error": [
          {
            "group": "500 Internal Server Error",
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
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"ok\": false,\n  \"msg\": \"Your token is invalid\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"ok\": false,\n  \"msg\": \"Not enough permissions to do this action\"\n}",
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
    "url": "/user/refresh/refreshAccess",
    "title": "Refresh the accesstoken",
    "name": "refreshAccess",
    "group": "refresh",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:accesstoken",
            "description": "<p>Users unique access-token.</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Cookie:refreshtoken",
            "description": "<p>Users unique refresh-token.</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Users unique email.</p>"
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
    "filename": "src/routes/refresh/refreshAccess.js",
    "groupTitle": "Refresh routes",
    "groupDescription": "<p>Routes where you need your refresh-token</p>",
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
            "field": "InvalidToken",
            "description": "<p>Your token is invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotEnoughPermissions",
            "description": "<p>Not enough permissions to do this action</p>"
          }
        ],
        "500 Internal Server Error": [
          {
            "group": "500 Internal Server Error",
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
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"ok\": false,\n  \"msg\": \"Your token is invalid\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"ok\": false,\n  \"msg\": \"Not enough permissions to do this action\"\n}",
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
