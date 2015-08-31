module.exports = (function() {
    //modules requirements
    var webserver = require('./webserver/webserver'),
        config = require('./config'),
        oop = require('./utils/oop'),
        //Methos
        launchServer,
        destroyServer;

    launchServer = function(options, done) {
        if (!options || options.constructor !== Object) {
            throw new Error('No options given');
        }
        if (!done || done.constructor !== Function) {
            throw new Error('No callback given');
        }
        //Generate configuration
        config.create(options);
        console.log("[CONFIG] created");
        //Run the webserver -> router -> orm = REST
        webserver.create(function(server){
            console.log('[WEBSERVER] listening: ' + config.baseUrl());
            done();
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