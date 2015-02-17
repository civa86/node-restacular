(function () {
    var rest = require('../../'),
        request = require('request'),
        server = null,
        storage = null;
    
    var restConfiguration = {
        server: {port: "3001"},
        storage: require('../test-storage')["test"],
        model: require('../test-model')
    };
    
    describe("Express REST Service", function () {
        it("is created", function(done){
            rest.create(restConfiguration, function (_server, _storage) {
                server = _server;
                storage = _storage;
                
                expect(server).not.toBe(null);
                expect(storage).not.toBe(null);
                
                done();
            });
        });

        it("database is filled", function (done) {
            var fixtures = require("../fixture.json");
            for (var i in fixtures) {
                var model = storage.getModel(i);
                for (var j = 0; j < fixtures[i].length; j++) {
                    var tmp = new model(fixtures[i][j]);
                    tmp.save(done);
                }

            }
        });

        
        it("webserver works", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port;
            request(url, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(200);
                done();
            });
        });
        
        it("api are live", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api";
            request(url, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(200);
                done();
            });
        });
   
//        it("database is cleared", function (done) {
//            var fixtures = require("../fixture.json");
//            for (var i in fixtures) {
//                var model = storage.getModel(i);
//                model.destroyAll(done);
//
//            }
//        });
        
    });
})();


