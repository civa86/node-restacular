(function () {
    var rest = require('../../'),
        request = require('request'),
        server = null,
        id;
    
    var restConfiguration = {
        server: {port: "3001"},
        storage: require('../test-storage')["test"],
        model: require('../test-model')
    };
    
    describe("NODE RESTAcular Test", function () {
        it("is created", function(done){
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
        
        it("post resource is empty", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post";
            request(url, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(200);
                expect(res.message.length).toEqual(0);
                done();
            });
        });
        
        it("post record is created", function (done) {
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
        
        it("get post record", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post/" + id;
            request(url, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(200);
                done();
            });
        });
        
        it("post record is updated", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post/" + id;
            request.put({uri: url, form: {title: "test2", description: "Test text 2"}}, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(200);
                expect(res.message.title).toEqual("test2");
                expect(res.message.description).toEqual("Test text 2");
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
        
        it("post resource is empty again", function (done) {
            var url = "http://localhost:" + restConfiguration.server.port + "/api/post";
            request(url, function (error, response, body) {
                var res = JSON.parse(body);
                expect(res.code).toEqual(200);
                expect(res.message.length).toEqual(0);
                done();
            });
        });
                
    });
})();


