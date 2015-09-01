module.exports = (function() {
    var _protocols = {},
        registerProtocol,
        isRegisteredProtocol,
        implement;

    registerProtocol = function(protocolName, object) {
        if (!protocolName || protocolName.constructor !== String) {
            throw new Error("INTERFACES :: protocolName must be a String");
        }
        if (!object || object.constructor !== Object) {
            throw new Error("INTERFACES :: only Object can registered as protocol");
        }
        if (_protocols[protocolName]) {
            throw new Error("INTERFACES :: " + protocolName + " already registered");
        }
        _protocols[protocolName] = object;
    };

    isRegisteredProtocol = function(protocolName) {
        if (!protocolName || protocolName.constructor !== String) {
            throw new Error("INTERFACES :: protocolName must be a String");
        }
        return (_protocols[protocolName]) ? true : false;
    };


    implement = function(object, protocols) {
        if (!object || object.constructor !== Object) {
            throw new Error("INTERFACES :: only Object can implement protocols");
        }
        if (!protocols || protocols.constructor !== Array) {
            throw new Error("INTERFACES :: protocols must be an Array of String");
        }
        for (var i = 0; i < protocols.length; i++) {
            var interf = _protocols[protocols[i]];
            if (!interf || interf.constructor !== Object) {
                throw new Error(protocols[i] + " is not a registered protocol");
            }
            for (var prop in interf) {
                if (!object[prop] || object[prop].constructor !== Function) {
                    throw new Error("INTERFACES :: method [" + prop + "] missing from object prototype.");
                }
            }
        }
        return true;
    };

    return {
        registerProtocol: registerProtocol,
        isRegisteredProtocol: isRegisteredProtocol,
        implement: implement
    };
})();

