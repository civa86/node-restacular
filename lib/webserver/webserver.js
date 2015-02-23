/**
 * The webserver module
 * @module server/webserver
 */
module.exports = (function() {
    //modules requirements
    var express = require("express"),
        bodyParser = require('body-parser'),
        //exphbs = require('express-handlebars'),
        errors = require('./errors'),
        router = require('./router'),
        config = require('../config'),
        //attributes
        app = express(),
        server = null,
        serverConfig = null,
        aclRules = null,
        //methods
        setViewEngine,
        setApplication,
        setErrorHandlers,
        preExecute,
        checkAcl,
        create,
        destroy;

    setViewEngine = function(_config) {
        /*
        app.set('views', _config.partialsDir);
        app.engine('.hbs', exphbs({
            layoutsDir: _config.layoutsDir,
            partialsDir: _config.partialsDir,
            defaultLayout: 'main',
            extname: '.hbs'
        }));
        app.set('view engine', '.hbs');
        */
    };

    setApplication = function(_router){
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        
        app.use("/", preExecute);

        app.use("/" + serverConfig.apiPrefix, _router);
    };

    setErrorHandlers = function() {
        app.use(errors.handle404);
        app.use(errors.handleGenericError);
    };

    checkAcl = function(req, done) {
        var urlComp = req.path.split("/");
        var acl = null;
        var aclName = "*";
        if (aclRules && aclRules["*"]) {
            acl = aclRules["*"][req.method];
        }

        for (var i = 0; i < urlComp.length; i++) {
            if (aclRules && aclRules[urlComp[i]] && aclRules[urlComp[i]][req.method]) {
                acl = aclRules[urlComp[i]][req.method];
                aclName = urlComp[i];
                break;
            }
        }

        if (acl) {
            var rule = acl;
            var remoteAddress = req.connection.remoteAddress;
            console.log("Incoming connection from: " + remoteAddress);
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

    preExecute = function(req, res, next) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        checkAcl(req, function(error) {
            if (error) {
                res.status(403);
                res.send(JSON.stringify({code: 403, message: error}));
            }
            else {
                if (req.path === "/") {
                   res.send(JSON.stringify({code: 200, message: "It works!"})); 
                }
                else {
                    next();
                }
            }
        });
    };

    create = function(done) {
        aclRules = config.getAcl();
        serverConfig = config.getServerConfig();

        router.create(function(_router) {
            setViewEngine(serverConfig);
            
            setApplication(_router);

            setErrorHandlers();

            server = app.listen(serverConfig.port);

            done(server);

        });

    };

    destroy = function() {
        server.close();
        return true;
    };


    return {
        create: create,
        destroy: destroy
    };
})();