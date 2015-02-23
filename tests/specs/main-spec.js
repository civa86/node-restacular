(function () {
    var rest = require('../../'),
        request = require('request'),
        server = null;
    
    var restConfiguration = {
        server: {port: "3001"},
        storage: require('../test-storage')["test"],
        model: require('../test-model')
    };
    
    describe("Express REST Service", function () {
        it("is created", function(done){
            rest.launchServer(restConfiguration, function (_server) {
                server = _server;
                expect(server).not.toBe(null);
                done();
            });
        });

//        it("webserver works", function (done) {
//            var url = "http://localhost:" + restConfiguration.server.port;
//            request(url, function (error, response, body) {
//                var res = JSON.parse(body);
//                expect(res.code).toEqual(200);
//                done();
//            });
//        });
//        
//        it("api are live", function (done) {
//            var url = "http://localhost:" + restConfiguration.server.port + "/api";
//            request(url, function (error, response, body) {
//                var res = JSON.parse(body);
//                expect(res.code).toEqual(200);
//                done();
//            });
//        });
   
        
    });
})();


