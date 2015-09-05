(function() {
    var rest = require("./"),
        restConfiguration;

    restConfiguration = {
        server: {port: "3000"},
        storage: require('./resources/test-storage')["development"],
        model: require('./resources/test-model'),
        acl: {
            "*": {
                "GET": {
                    "from-ip": ["127.0.0.1"],
                    "from-proxy": ["127.0.0.1"]
                }
            }
        }
    };

    rest.launchServer(restConfiguration, function() {
        console.log("[ ENV ] " + process.env.NODE_ENV + " [ PATH ] " + __dirname);
    });

})();


