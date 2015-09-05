# Node RESTacular

Spectacular REST service generator. 

It works with all kind of database, simply download an adapter and run RESTacular! 

[![Build Status](https://travis-ci.org/civa86/node-restacular.svg?branch=master)](https://travis-ci.org/civa86/node-restacular)
[![npm version](https://badge.fury.io/js/node-restacular.svg)](http://badge.fury.io/js/node-restacular)

## Installation

Install the npm package
```bash
$ npm install node-restacular
```

## Database Adapter

RESTacular use [Waterline](https://github.com/balderdashy/waterline) ORM, so you are free to use (or write) its adapters.

[Database Adapters List](https://github.com/balderdashy/waterline#community-adapters).

In this example mongodb is choosen: [sails-mongodb](https://github.com/balderdashy/sails-mongo)

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
        server: Object, 	// Optional. Docs in #Server Configuration section
       	storage: Object,    // Required. Docs in #Storage Configuration section
        model: Function,    // Required. Docs in #Model section
        acl: Object		    // Optional. Docs in #ACL section
    };

    restacular.launchServer(restConfiguration, function() {
        //Run additional code if you need!
    }); 
```

## Server Configuration

Set your `server`  configuration.<br>
`server` settings are optional and default generated url is http://localhost:3000/api

```javascript
    
    {
        server: {
			hostname: "localhost", 	// Default value
			port: "3000", 			// Default value
			apiPrefix: "api"		// Default value.

		},
		
		...
	}
```


## Storage Configuration

Set your `storage` configuration.<br>
`storage` settings are required and depend on your database storage and adapter

```javascript
	
	{
		storage: {
            adapter: require("db-adapter"), //Example: sails-mongo
	        host: "db-host",			    //Example: localhost
	        port: "db-port",			    //Example 27017
	        username: "db-user",		    //Example root
	        password: "db-pass",		    //Example root
	        database: "db-name"			    //Example testdb
		},

		...

	}
```

## Model

Define your Model Object, describe your resources with their properties , associations and behaviours.

```javascript
    
    {
        model: {
            <resource-name>: {
                <property-name>: {
                    type: <data-type>,
                    <attribute-name>: <attribute-value>,
                },
                <association-field-name>: {
                  model: <resource-name> // One-to-One reference to association-resource
                }
                behaviours: {
                    <lifecycle-callback>: function(values, next){
                        console.log(values);
                        next();
                    }
                }
            },
            
            ...
        }
    }
```

`<resource-name>` correspond to db table name. 

`<property-name>` correspond to db table column name. 

`<resource-name>` will match CRUD generated route. lowercase recommended.
 
#### Data Types and Property Attributes

Read official [Waterline Data Type and Attributes](https://github.com/balderdashy/waterline-docs/blob/master/models/data-types-attributes.md)

#### Associations Documentation

Read official [Waterline Associations](https://github.com/balderdashy/waterline-docs/blob/master/models/associations/associations.md)

#### Behaviours and Lifecycle Callbacks Documentation

Read official [Waterline Lifecycle Callback](https://github.com/balderdashy/waterline-docs/blob/master/models/lifecycle-callbacks.md)

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

Routes access is public by default.

If you don't set any `acl` CRUD are exposed to everyone.

With `acl` configuration you can choose access rules for any resource/method.

You can specify wildcard rules with char: `*`

```javascript

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
            "resource-name": {
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

In the example above `resource-name` is enabled only from localhost for `GET` and `POST` methods, `PUT` and `DELETE` are disabled.

All other resources are public, following `*` generic rule.

#### Behind Proxy: Problem

If you are behind a proxy, your "from-ip" will always be the Proxy IP and you can't check who is really calling the APIs.

It can happen, for example, if you put Apache Webserver in front of Node.js and you use mod_proxy to send calls internally,
avoinding CORS requests.

Example of a Proxy Apache conf

```bash
    <VirtualHost *:80>
        ServerName restacular.local
        ProxyPass /api http://localhost:3000/api
        ProxyPassReverse /api http://localhost:3000/api
    </VirtualHost>
```

#### Behind Proxy ACL Configuration

To avoid the problem described above you can set another property on your ACL rules: `from-proxy`

ACL will check your HTTP headers, validating rules on `X-Forwarded-For` value.

For wildcards or any resource/method you can set: `from-ip | from-proxy` properties.
 
```javascript
    acl: {
        "*": {
            "POST": {
                "from-ip": ["127.0.0.1"],
                "from-proxy": ["127.0.0.1"]
            }
        },
        "resource-name": {
            "GET": {
                "from-ip": ["127.0.0.1"],
                "from-proxy": ["192.168.1.1"]
            },
            ...
        },
        ...
    }
```

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
