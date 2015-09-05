module.exports = (function() {
    //modules requirements
    var webserver = require('./webserver/webserver'),
        config = require('./config'),
        //Methos
        launchServer,
        setAcl,
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

    setAcl = function(_acl){
        config.setAcl(_acl);
        return true;
    };
    
    destroyServer = function(){
        webserver.destroy();
        return true;
    };

    return {
        launchServer: launchServer,
        setAcl: setAcl,
        destroyServer: destroyServer
    };

})();