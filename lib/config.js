module.exports = (function() {
    //Modules requirements
    var path = require('path'),
        oop = require('./utils/oop'),
        //Metohds
        create,
        //Attributes
        created = false,
        moduleRoot,
        templateDir,
        layoutsDir,
        partialsDir,
        hostname,
        port,
        apiPrefix,
        storage,
        baseUrl,
        apiUrl,
        model,
        ormService,
        acl,
        optionsServer,
        //Methods
        getStorageConfig,
        getServerConfig,
        getModel,
        getOrmService,
        getAcl;

    create = function(options) {
        if (!created) {
            if (!options || options.constructor !== Object) {
                throw new Error("No configuration given");
            }
            if (!options.storage || options.storage.constructor !== Object) {
                throw new Error("No storage configuration given");
            }
            if ((!options.model || options.model.constructor !== Function) && (!options.ormService || typeof options.ormService !== "object")) {
                throw new Error("No model configuration given");
            }

            moduleRoot = path.resolve(__dirname + "/../");
            templateDir = path.join(moduleRoot, "views");
            layoutsDir = path.join(templateDir, "layouts");
            partialsDir = path.join(templateDir, "partials");
            //Required Settings
            storage = options.storage;
            model = options.model || null;
            //Optional Settings
            optionsServer = options.server || {};
            hostname = optionsServer.hostname || 'localhost';
            port = optionsServer.port || '3000';
            apiPrefix = optionsServer.apiPrefix || 'api';
            //ACL Settings
            acl = options.acl || null;
            
            ormService = require('./orm/jugglingOrm');
            if(options.ormService && typeof options.ormService === "object"){
                ormService = options.ormService;
            }
            
            if(!oop.isRegisteredProtocol('genericOrmProtocol') || !oop.implement(ormService, ["genericOrmProtocol"])){
                throw new Error("genericOrmProtocol not implemetented");
            }
            
            
            created = true;
        }
        else{
            throw new Error("Configuration already created! you have tu run create only once!");
        }


        
    };

    baseUrl = function() {
        return 'http://' + hostname + ":" + port;
    };

    apiUrl = function() {
        var b = baseUrl();
        return b + '/' + apiPrefix;
    };
    getStorageConfig = function() {
        return storage;
    };

    getServerConfig = function() {
        return {
            viewsPath: templateDir,
            layoutsDir: layoutsDir,
            partialsDir: partialsDir,
            hostname: hostname,
            port: port,
            apiPrefix: apiPrefix,
            baseUrl: baseUrl,
            apiUrl: apiUrl
        };
    };

    getModel = function() {
        return model;
    };
    
    getOrmService = function(){
        return ormService;
    };
    
    getAcl = function(){
        return acl;
    };
    
    return {
        create: create,
        getStorageConfig: getStorageConfig,
        getServerConfig: getServerConfig,
        getModel: getModel,
        getOrmService: getOrmService,
        getAcl: getAcl,
        baseUrl: baseUrl,
        apiUrl: apiUrl
    };
})();
