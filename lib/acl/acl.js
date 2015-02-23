module.exports = (function () {
    var config = require('../config'),
        //Methods
        checkRules;

    checkRules = function (req, done) {
        var aclRules = config.getAcl();
        var urlComp = req.path.split("/");
        var acl = null;
        if (aclRules && aclRules["*"]) {
            acl = aclRules["*"][req.method];
        }

        for (var i = 0; i < urlComp.length; i++) {
            if (aclRules && aclRules[urlComp[i]] && aclRules[urlComp[i]][req.method]) {
                acl = aclRules[urlComp[i]][req.method];
                break;
            }
        }

        if (acl) {
            var rule = acl;
            var remoteAddress = req.connection.remoteAddress;
            try {
                //Block IP
                if (!rule["from-ip"] || (rule["from-ip"] !== "*" && rule["from-ip"].indexOf(remoteAddress) === -1)) {
                    done("IP Address: " + remoteAddress + " not allowed for " + req.method);
                }
                //Success ACL
                else {
                    done();
                }
            }
            catch (e) {
                done("ACL not well formed");
            }
        }
        else {
            done();
        }
    };

    return {
        checkRules: checkRules
    };
})();