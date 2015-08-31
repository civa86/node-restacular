(function () {
    var config = require('./config'),
    restConfiguration = {
        //TODO move to some file....share with test server!!
        server: {port: "3001"},
        storage: require('../tests/test-storage')["test"],
        model: require('../tests/test-model')
    };

    describe("[node-restacular][config.js]", function () {
        it("should have a create method", function(done){
            expect(config.create.constructor).toBe(Function);

            done();
        });

        it("should throw error if no options object given", function(done){
            expect(function(){
                config.create();
            }).toThrow( new Error("No configuration given") );

            done();
        });
        it("should throw error if no options.storage object given", function(done){
            expect(function(){
                config.create({});
            }).toThrow( new Error("No storage configuration given") );

            done();
        });

        it("should throw error if no options.model object given", function(done){
            expect(function(){
                config.create({storage:{}});
            }).toThrow( new Error("No model configuration given") );

            done();
        });

        it("should throw error if options.ormService does not implement genericOrmProtocol", function(done){
            expect(function(){
                config.create({storage:{}, model: {}, ormService: {}});
            }).toThrow( new Error("genericOrmProtocol not implemetented") );

            done();
        });



        it("should throw error if is created twice", function(done){
            config.create(restConfiguration);

            expect(function(){
                config.create(restConfiguration);
            }).toThrow( new Error("Configuration already created! you have tu run create only once!") );

            done();
        });

        it("should have a baseUrl method that returns expected settings", function(done){
            expect(config.baseUrl.constructor).toBe(Function);

            var b = config.baseUrl();
            expect(b).toEqual('http://localhost:' + restConfiguration.server.port);

            done();
        });

        it("should have a apiUrl method that returns expected settings", function(done){
            expect(config.apiUrl.constructor).toBe(Function);
            var b = config.baseUrl();
            var a = config.apiUrl();
            expect(a).toEqual(b + "/api");

            done();
        });

        it("should have a getStorageConfig method that returns expected settings", function(done){
            expect(config.getStorageConfig.constructor).toBe(Function);
            var storage = config.getStorageConfig();
            expect(storage.constructor).toBe(Object);
            expect(storage.driver).toEqual(restConfiguration.storage.driver);
            expect(storage.host).toEqual(restConfiguration.storage.host);
            expect(storage.port).toEqual(restConfiguration.storage.port);

            done();
        });

        it("should have a getServerConfig method that returns expected settings", function(done){
            expect(config.getServerConfig.constructor).toBe(Function);
            var server = config.getServerConfig();
            expect(server.constructor).toBe(Object);

            done();
        });

        it("should have a getModel method that returns expected settings", function(done){
            expect(config.getModel.constructor).toBe(Function);
            var model = config.getModel();
            expect(model.constructor).toBe(Object);

            done();
        });

        it("should have a getOrmService method that returns expected settings", function (done) {
            expect(config.getOrmService.constructor).toBe(Function);
            var orm = config.getOrmService();
            expect(orm.constructor).toBe(Object);

            done();
        });

        it("should have a getAcl method that returns null, because it isn't specified", function (done) {
            expect(config.getAcl.constructor).toBe(Function);
            var acl = config.getAcl();
            expect(acl).toBe(null);

            done();
        });

    });
})();


