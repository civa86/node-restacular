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

        it("should have a baseUrl method that return expected settings", function(done){
            expect(config.baseUrl.constructor).toBe(Function);

            var b = config.baseUrl();
            expect(b).toEqual('http://localhost:' + restConfiguration.server.port);

            done();
        });




    });
})();


