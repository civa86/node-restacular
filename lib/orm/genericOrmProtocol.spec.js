(function () {
    var ormProtocol = require('./genericOrmProtocol');

    describe("[node-restacular][orm/genericOrmProtocol.js]", function () {

        it("should have a connect function definition", function(done){
            expect(ormProtocol.connect.constructor).toBe(Function);
            ormProtocol.connect();
            done();
        });

        it("should have a findAll function definition", function(done){
            expect(ormProtocol.findAll.constructor).toBe(Function);
            ormProtocol.findAll();
            done();
        });

        it("should have a findById function definition", function(done){
            expect(ormProtocol.findById.constructor).toBe(Function);
            ormProtocol.findById();
            done();
        });

        it("should have a count function definition", function(done){
            expect(ormProtocol.count.constructor).toBe(Function);
            ormProtocol.count();
            done();
        });

        it("should have a createRecord function definition", function(done){
            expect(ormProtocol.createRecord.constructor).toBe(Function);
            ormProtocol.createRecord();
            done();
        });

        it("should have a updateRecord function definition", function(done){
            expect(ormProtocol.updateRecord.constructor).toBe(Function);
            ormProtocol.updateRecord();
            done();
        });

        it("should have a deleteAll function definition", function(done){
            expect(ormProtocol.deleteAll.constructor).toBe(Function);
            ormProtocol.deleteAll();
            done();
        });

        it("should have a deleteById function definition", function(done){
            expect(ormProtocol.deleteById.constructor).toBe(Function);
            ormProtocol.deleteById();
            done();
        });

        it("should have a disconnect function definition", function(done){
            expect(ormProtocol.disconnect.constructor).toBe(Function);
            ormProtocol.disconnect();
            done();
        });


    });
})();




