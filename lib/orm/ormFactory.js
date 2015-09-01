module.exports = (function() {
    var config = require("../config"),
        //Attributes
        baseOrmService,
        strorageConfig,
        model,
        //Methods
        getInstance,
        initService,
        closeService;


    initService = function(done) {
        baseOrmService = config.getOrmService();
        strorageConfig = config.getStorageConfig();
        model = config.getModel();

        baseOrmService.connect(strorageConfig, model, function(err) {
            if (err) {
                done(err);
            }
            else {
                done();
            }
        });
    };
    
    getInstance = function(entity){
        //Se esiste una folder di override e una classe che si chiama
        //entityController -> estendo l'oggetto con il baseOrmService
        //elimino i metodi di connect disconnect e definemodel...
        return baseOrmService;
    };

    closeService = function(){
        baseOrmService.disconnect();
    };

    return {
        initService: initService,
        getInstance: getInstance,
        closeService: closeService
    };


})();

