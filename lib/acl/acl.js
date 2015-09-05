module.exports = (function () {
    var aclRules = null,
        //Methods
        checkRules,
        setRules;

    setRules = function(rules){
        aclRules = rules;
    };

    checkRules = function (req, done) {
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
            var forwardedIp = (req.headers) ? req.headers['x-forwarded-for'] : null;

            //Block IP
            if (!rule["from-ip"] || (rule["from-ip"] !== "*" && rule["from-ip"].indexOf(remoteAddress) === -1)) {
                done("IP Address: " + remoteAddress + " not allowed for " + req.method);
            }

            //Block Forwarded IP from proxy
            else if (rule["from-proxy"] && rule["from-proxy"] !== "*" && forwardedIp && rule["from-proxy"].indexOf(forwardedIp) === -1) {
                done("Forwarded IP Address: " + forwardedIp + " not allowed for " + req.method);
            }

            else{
                //Success ACL
                done();
            }


        }
        else {
            done();
        }
    };

    return {
        checkRules: checkRules,
        setRules: setRules
    };
})();