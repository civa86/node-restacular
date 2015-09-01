(function () {
    var rest = require('../'),
        request = require('request'),
        server = null,
        id,
        restConfiguration = {
            //TODO move to some file....share with test server!!
            server: {port: "3001"},
            storage: require('../tests/test-storage')["test"],
            model: require('../tests/test-model')
        },
        badCfg = {
            storage: {
                driver: "sails-mysql",
                host: "localhost",
                port: "27017",
                username: "",
                password: "",
                database: "test-restacular"
            },
            model: require('../tests/test-model')
        };

    //TODO check on 'it' test descriptions...

    describe("[node-restacular][node-restacular.js]", function () {

        it("is should throw error if no options given", function(done){
            expect(function(){
                rest.launchServer();
            }).toThrow( new Error("No options given") );

            done();
        });

        it("is should throw error if no callback given", function(done){
            expect(function(){
                rest.launchServer({});
            }).toThrow( new Error("No callback given") );

            done();
        });

        it("is should throw error if db adapter not found", function(done){
            expect(function(){
                rest.launchServer(badCfg, function(){});
            }).toThrow( new Error("Adapter '" + badCfg.storage.driver + "' not found in node_modules") );

            done();
        });

        it("is should launch server", function(done){
            rest.launchServer(restConfiguration, function (_server) {
                server = _server;
                expect(server).not.toBe(null);
                done();
            });
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

        it("should get a 404 response for /failRequest", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/failRequest";
            request(url, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(404);
                done();
            });
        });

        it("should get a 404 response for entity that not exists", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/failEntity";
            request(url, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(404);
                done();
            });
        });

        it("post resource is empty", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post";
            request(url, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(200);
                expect(res.message.length).toEqual(0);
                done();
            });
        });

        it("should fail posting a void record", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post";
            request.post({uri: url}, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(406);
                expect(res.message).toEqual('No record to create');
                done();
            });
        });

        it("should fail record validation on required field", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post";
            request.post({uri: url, form: {description: "Test text"}}, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(500);
                done();
            });
        });

        it("should create a post record", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post";
            request.post({uri: url, form: {title: "test", description: "Test text"}}, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(200);
                expect(res.message.title).toEqual("test");
                expect(res.message.description).toEqual("Test text");
                expect(res.message.id).not.toBe(null);
                expect(res.message.id).not.toBe(undefined);
                expect(res.message.id).not.toEqual('');
                id = res.message.id;
                done();
            });
        });

        it("post resource has one record", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post";
            request(url, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(200);
                expect(res.message.length).toEqual(1);
                id = res.message[0].id;
                done();
            });
        });

        it("count post is 1", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post/count";
            request(url, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(200);
                expect(res.message).toEqual(1);
                done();
            });
        });

        it("get post record", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post/" + id;
            request(url, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(200);
                done();
            });
        });

        it("should fail putting a void record", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post/" + id;
            request.put({uri: url}, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(406);
                expect(res.message).toEqual("No record to update");
                done();
            });
        });

        it("should update post record with id: " + id, function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post/" + id;
            request.put({uri: url, form: {title: "test2", description: "Test text 2"}}, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(200);
                expect(res.message[0].title).toEqual("test2");
                expect(res.message[0].description).toEqual("Test text 2");
                done();
            });
        });

        it("another post record is created", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post";
            request.post({uri: url, form: {title: "another test", description: "Another Test text"}}, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(200);
                expect(res.message.title).toEqual("another test");
                expect(res.message.description).toEqual("Another Test text");
                expect(res.message.id).not.toBe(null);
                expect(res.message.id).not.toBe(undefined);
                expect(res.message.id).not.toEqual('');
                done();
            });
        });

        it("post resource has two records", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post";
            request(url, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(200);
                expect(res.message.length).toEqual(2);
                done();
            });
        });

        it("first post is deleted", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post/" + id;
            request({uri: url, method: "DELETE"}, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(200);
                done();
            });
        });

        it("post resource has one record again, but not the first one", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post";
            request(url, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(200);
                expect(res.message.length).toEqual(1);
                expect(id).not.toEqual(res.message[0].id);
                done();
            });
        });

        it("post resource is truncated", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post";
            request({uri: url, method: "DELETE"}, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(200);
                done();
            });
        });

        it("post resource is empty again!", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post";
            request(url, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(200);
                expect(res.message.length).toEqual(0);
                done();
            });
        });

        it("should change ACL", function (done) {
            var r = rest.setAcl({
                "*": {
                    "GET": {
                        "from-ip": "none"
                    }
                }
            });
            expect(r).toBe(true);
            done();
        });

        it("should be blocked for any GET request", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post";
            request(url, function (error, response, body) {
                var res = JSON.parse(body);
                console.log(res);
                expect(res.code).toEqual(403);
                done();
            });
        });

        it("should destroy server", function(done){
            expect(rest.destroyServer()).toEqual(true);
            done();
        });

        it("should not works", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port;
            request(url, function (error, response, body) {
                expect(error.code).toEqual("ECONNREFUSED");
                done();
            });
        });

    });
})();


