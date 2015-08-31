module.exports = (function() {
    //modules requirements
    var webserver = require('./webserver/webserver'),
        config = require('./config'),
        oop = require('./utils/oop'),
        //Methos
        launchServer,
        destroyServer;

    launchServer = function(options, done) {
        //Generate configuration
        config.create(options);
        console.log("[CONFIG] created");
        //Run the webserver -> router -> orm = REST
        webserver.create(function(server){
            if (server) {
                console.log('[WEBSERVER] listening: ' + config.baseUrl());
                if (done && done.constructor === Function) {
                    done(); 
                }
            }
        });
        
    };
    
    destroyServer = function(){
        webserver.destroy();
        return true;
    };

    return {
        launchServer: launchServer,
        destroyServer: destroyServer
    };

})();