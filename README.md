# Node RESTAcular

Spectacular REST service generator<br>
It's based on [node](http://nodejs.org), it exposes CRUD with [express](http://expressjs.com) and it comes with [jugglingdb](http://jugglingdb.co) ORM

[![npm version](https://badge.fury.io/js/node-restacular.svg)](http://badge.fury.io/js/node-restacular)
[![Dependency Status](https://david-dm.org/civa86/node-restacular.svg)](https://david-dm.org/civa86/node-restacular)

##Installation

Install the npm package
```bash
$ npm install node-restacular
```

## Database Adapter

Choose your favourite database [adapter](http://jugglingdb.co/#ADAPTERS), for example [jugglingdb-mongodb](https://github.com/jugglingdb/mongodb-adapter)

```bash
$ npm install jugglingdb-mongodb
```

## Features

*	Full configurable services
*	Storage system supporting different database engines
*	Auto generated CRUD operations
*	Overridable built-in ORM
*	ACL permissions for single routes/method

## Usage
```javascript
var restacular = require('node-restacular'),
           		 restConfiguration;
	
    restConfiguration = {
        server: Object, 	// Optional. Docs in #Configuration section
       	storage: Object, 	// Required. Docs in #Configuration section
        model: Function,    // Required. Docs in #Model section
        acl: Object, 		// Optional. Docs in #ACL section
        ormService: Object // Optional. Docs in #ORM section
    };
    
    restacular.launchServer(restConfiguration, function() {
        //Run additinal code if you need!
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
			hostname: "localhost", 	// Defaul value
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
For jugglingdb Schema definition refer to the official [documentation](http://jugglingdb.co/schema.3.html).<br>
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

## ORM Override
If you override the ORM you will choose what to inject in the function in the `defineModel` hook. You can inject your orm and your schema. (done function comes as argument for the hook)

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


