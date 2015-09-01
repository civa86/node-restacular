(function() {
    var rest = require("./"),
        restConfiguration;

    restConfiguration = {
        server: {port: "3000"},
        storage: require('./resources/test-storage')["development"],
        model: require('./resources/test-model')
    };

    rest.launchServer(restConfiguration, function() {
        console.log("[ ENV ] " + process.env.NODE_ENV + " [ PATH ] " + __dirname);
    });

})();


