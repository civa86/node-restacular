module.exports = (function() {
    //modules requirements
    var webserver = require('./webserver'),
        config = require('./config'),
        oop = require('./utils/oop'),
        //Methos
        launchServer;

    launchServer = function(options, fx) {
        //Register Protocols
        oop.registerProtocol("genericOrmProtocol", require('./orm/genericOrmProtocol'));
        //Generate configuration
        config.create(options);
        console.log("[CONFIG] created");
        //Run the webserver -> router -> orm = REST
        webserver.create(function(server){
            if (server) {
                console.log('[WEBSERVER] listening: ' + config.baseUrl());
                if (fx && typeof fx === "function") {
                    fx(); 
                }
            }
        });
        
    };

    return {
        launchServer: launchServer
    };

})();