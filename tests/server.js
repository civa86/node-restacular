(function() {
    var rest = require("../lib/node-restacular"),
        restConfiguration;

    restConfiguration = {
        server: {port: "3000"},
        storage: require('./test-storage')["development"],
        model: require('./test-model'), //Model required if no ormService override given!
        //ormService: require("./test-orm"),
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
            "post": {
                "GET": {
                    "from-ip": ["127.0.0.1"]
                }
            }
        }
    };
    //AGGIUNGI A REST CONGIGURATION ANCHE controllers e views come directrory di override!!!

    rest.launchServer(restConfiguration, function() {
        console.log("[ ENV ] " + process.env.NODE_ENV + " [ PATH ] " + __dirname);
    });

})();


