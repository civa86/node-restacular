# Node RESTacular

Spectacular REST service generator. 

It works with all kind of database, simply download an adapter and run RESTacular! 

[![Build Status](https://travis-ci.org/civa86/node-restacular.svg?branch=master)](https://travis-ci.org/civa86/node-restacular)
[![npm version](https://badge.fury.io/js/node-restacular.svg)](http://badge.fury.io/js/node-restacular)
[![Dependency Status](https://david-dm.org/civa86/node-restacular.svg)](https://david-dm.org/civa86/node-restacular)

## Installation

Install the npm package
```bash
$ npm install node-restacular
```

## Database Adapter

Choose your favorite [database adapter](https://github.com/balderdashy/waterline#community-adapters), for example [sails-mongodb](https://github.com/balderdashy/sails-mongo)

```bash
$ npm install sails-mongo
```

## Features

*	Full configurable services
*	Storage system supporting different database engines
*	Auto generated CRUD operations
*	ACL permissions for single routes/method

## Usage
```javascript
var restacular = require('node-restacular'),
           		 restConfiguration;

    restConfiguration = {
        server: Object, 	// Optional. Docs in #Configuration section
       	storage: Object,    // Required. Docs in #Configuration section
        model: Function,    // Required. Docs in #Model section
        acl: Object		    // Optional. Docs in #ACL section
    };

    restacular.launchServer(restConfiguration, function() {
        //Run additional code if you need!
    });
```

## Configuration

Set your `server`  configuration.<br>
`server` settings are optional and default generated url is http://localhost:3000/api

Set your `storage` configuration.<br>
`storage` settings are required and depend on your database storage and adapter

```javascript
	{
		server: {
			hostname: "localhost", 	// Default value
			port: "3000", 			// Default value
			apiPrefix: "api"		// Default value.

		},
		storage: {
			driver: "driver-adapter", 	//Example: mondodb. Driver name based on your db adapter.
	        host: "db-host",			//Example: localhost
	        port: "db-port",			//Example 27017
	        username: "db-user",		//Example root
	        password: "db-pass",		//Example root
	        database: "db-name"			//Example testdb
		},

		...

	}
```

## Model

Define your Model in a function. The function take three arguments:<br>
`orm`: the Object that stores models.<br>
`schema`: the Object that defines some data types.<br>
`done` the Function to call when your model definition is completed.<br>

This function is automatically called during router initialization process, immediately after `launchServer` methods is invoked.<br>

```javascript
    {
        ...

        model: function(orm, schema, done) {
            //Example resource
            orm.define("resourceName", {
                property: String, ,
                description: schema.Text,
                approved:  Boolean,
                createdAt: Date
            });
            //Be sure to call done callback after model definition
            done();
        },

        ...
    }
```
Each resource define its schema: `orm.define("resourceName", {})`.<br>
For waterline Schema definition refer to the official [documentation](https://github.com/balderdashy/waterline-docs).<br>
`resourceName` will match CRUD generated routes. lowercase recommended.

## CRUD

After `model` definitions CRUD operations are automatically binded to router:

```
method        route                       action
------------------------------------------------------------
GET           /:resource                  find all
GET           /:resource/count            get count
GET           /:resource/:id              find by id
POST          /:resource                  create new
PUT           /:resource/:id              update by id
DELETE        /:resource/:id              delete
DELETE        /:resource                  delete all
```

## Access Control List

Routes access is public by default.<br>
If you don't set any `acl` CRUD are exposed to everyone.

With `acl` configuration you can choose access rules for any resource/method.<br>
You can specify wildcard rules with char: `*`

```javascript
        ...

        acl: {
            "*": {
                "GET": {
                    "from-ip": "*"
                },
                "POST": {
                    "from-ip": "*"
                },
                "PUT": {
                   "from-ip": "*"
                },
                "DELETE": {
                    "from-ip": "*"
                }
            },
            "resourceName": {
                "GET": {
                    "from-ip": ["127.0.0.1"]
                },
                "POST": {
                    "from-ip": ["127.0.0.1"]
                },
                "PUT": {
                   "from-ip": "none"
                },
                "DELETE": {
                    "from-ip": "none"
                }
            }
        },

        ...

```

In the example above `resourceName` is enabled only from localhost for `GET` and `POST` methods, `PUT` and `DELETE` are disabled.<br>
All other resources are public, following `*` rules.

## Next Realeases

*   CORS request setting
*   Override waterline ORM. Available: nedb, mongoose. Write your own!
*   Template engine integration to build your own response (handlebars engine)

## MIT License

```text
Copyright (C) 2015 Dario Civallero <dario.civallero@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
