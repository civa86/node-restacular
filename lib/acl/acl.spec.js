(function () {
    var acl = require('./acl'),
        rules = {
            "*": {
                "GET": {
                    "from-ip": "*"
                }
            },
            "post": {
                "POST": {
                    "from-ip": ["127.0.0.2", "127.0.0.3"]
                }
            }
        },
        mockRequest = {};

    describe("[node-restacular][acl/acl.js]", function () {

        it("should have a setRules method", function (done) {
            expect(acl.setRules.constructor).toBe(Function);
            acl.setRules(rules);
            done();
        });

        it("should have a checkRules method", function (done) {
            expect(acl.checkRules.constructor).toBe(Function);
            done();
        });

        it("should pass GET from any IP", function (done) {
            mockRequest = {
                path: "/api/post",
                method: "GET",
                connection: {
                    remoteAddress: '127.0.0.1'
                }
            };

            acl.checkRules(mockRequest, function(err){
                expect(err).toBe(undefined);
                done();
            });

        });

        it("should fail POST from 127.0.0.1", function (done) {
            mockRequest = {
                path: "/api/post",
                method: "POST",
                connection: {
                    remoteAddress: '127.0.0.1'
                }
            };

            acl.checkRules(mockRequest, function(err){
                expect(err).not.toBe(undefined);
                done();
            });

        });

        it("should pass POST from 127.0.0.2", function (done) {
            mockRequest = {
                path: "/api/post",
                method: "POST",
                connection: {
                    remoteAddress: '127.0.0.2'
                }
            };

            acl.checkRules(mockRequest, function(err){
                expect(err).toBe(undefined);
                done();
            });

        });

        it("should pass POST from 127.0.0.3", function (done) {
            mockRequest = {
                path: "/api/post",
                method: "POST",
                connection: {
                    remoteAddress: '127.0.0.3'
                }
            };

            acl.checkRules(mockRequest, function(err){
                expect(err).toBe(undefined);
                done();
            });
        });

        it("should change rules", function (done) {
            var newRules = {
                "*": {
                    "GET": {
                        "from-ip": ["127.0.0.1"],
                        "from-proxy": ["127.0.0.1"]
                    }
                }
            };

            acl.setRules(newRules);

            done();
        });

        it("should fail GET from ip 127.0.0.1, forwaded from 192.168.1.1", function (done) {
            mockRequest = {
                path: "/api/post",
                method: "GET",
                connection: {
                    remoteAddress: '127.0.0.1'
                },
                headers: {
                    "x-forwarded-for": '192.168.1.1'
                }
            };

            acl.checkRules(mockRequest, function(err){
                expect(err).not.toBe(undefined);
                done();
            });

        });

        it("should pass GET from ip 127.0.0.1, forwaded from 127.0.0.1", function (done) {
            mockRequest = {
                path: "/api/post",
                method: "GET",
                connection: {
                    remoteAddress: '127.0.0.1'
                },
                headers: {
                    "x-forwarded-for": '127.0.0.1'
                }
            };

            acl.checkRules(mockRequest, function(err){
                expect(err).toBe(undefined);
                done();
            });

        });
    });
})();


