(function () {
    var i = require('./interfaces'),
        testProtocol = {
            testFn: function(){}
        };

    describe("[node-restacular][utils/interfaces.js]", function () {

        it("should have a registerProtocol method", function(done){
            expect(i.registerProtocol.constructor).toBe(Function);

            done();
        });

        it("should have a isRegisteredProtocol method", function(done){
            expect(i.isRegisteredProtocol.constructor).toBe(Function);

            done();
        });

        it("should have a implement method", function(done){
            expect(i.implement.constructor).toBe(Function);

            done();
        });

        it("should throw error if register protocol name is not a String", function(done){
            expect(function(){
                i.registerProtocol(true, testProtocol);
            }).toThrow(new Error("INTERFACES :: protocolName must be a String"));
            done();
        });

        it("should throw error if register protocol is not a Object", function(done){
            expect(function(){
                i.registerProtocol("testProtocol", null);
            }).toThrow(new Error("INTERFACES :: only Object can registered as protocol"));
            done();
        });

        it("should register a protocol", function(done){
            i.registerProtocol("testProtocol", testProtocol);
            expect( i.isRegisteredProtocol("testProtocol")).toBe(true);
            done();
        });

        it("should throw error if try to register an already registered protocol", function(done){
            expect(function(){
                i.registerProtocol("testProtocol", testProtocol);
            }).toThrow(new Error("INTERFACES :: testProtocol already registered"));
            done();
        });

        it("should throw error if check registration without a String", function(done){
            expect(function(){
                i.isRegisteredProtocol();
            }).toThrow(new Error("INTERFACES :: protocolName must be a String"));
            done();
        });

        it("should return false if protocol is not registered", function(done){
            expect( i.isRegisteredProtocol("testProtocolNotRegistered")).toBe(false);
            done();
        });



    });
})();


