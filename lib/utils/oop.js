module.exports = (function() {
    var _protocols = {},
        extend,
        registerProtocol,
        isRegisteredProtocol,
        implement;

    

    extend = function(parent, child) {
        if (!parent || parent.constructor !== Object) {
            throw new Error("OOP :: parent is not an object instance");
        }
        if (!child || child.constructor !== Object) {
            throw new Error("OOP :: child is not an object instance");
        }
        for (var i in parent) {
            if (!child[i]) {
                child[i] = parent[i];
            }
        }
    };

    registerProtocol = function(protocolName, object) {
        if (!protocolName || protocolName.constructor !== String) {
            throw new Error("OOP :: protocolName must be a String");
        }
        if (!object || object.constructor !== Object) {
            throw new Error("OOP :: only Object can registered as procol");
        }
        if (_protocols[protocolName]) {
            throw new Error("OOP :: " + protocolName + " already registered");
        }
        _protocols[protocolName] = object;
    };

    isRegisteredProtocol = function(protocolName) {
        if (!protocolName || protocolName.constructor !== String) {
            throw new Error("OOP :: protocolName must be a String");
        }
        return (_protocols[protocolName]) ? true : false;
    };


    implement = function(object, protocols) {
        if (!object || object.constructor !== Object) {
            throw new Error("OOP :: only Object can implement protocols");
        }
        if (!protocols || protocols.constructor !== Array) {
            throw new Error("OOP :: protocols must be an Array of String");
        }
        for (var i = 0; i < protocols.length; i++) {
            var interf = _protocols[protocols[i]];
            if (!interf || interf.constructor !== Object) {
                throw new Error(protocols[i] + " is not a registered protocol");
            }
            for (var prop in interf) {
                if (interf[prop].constructor === Function) {
                    if (!object[prop] || object[prop].constructor !== Function) {
                        throw new Error("OOP :: method [" + prop + "] missing from object prototype.");
                    }
                }
            }
        }
        return true;
    };

    return {
        extend: extend,
        registerProtocol: registerProtocol,
        isRegisteredProtocol: isRegisteredProtocol,
        implement: implement
    };
})();

