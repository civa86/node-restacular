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
        acl = require('../acl/acl.js'),
        //attributes
        app = express(),
        server = null,
        serverConfig = null,
        //methods
        setViewEngine,
        setApplication,
        setErrorHandlers,
        preExecute,
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

    preExecute = function(req, res, next) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        acl.checkRules(req, function(error) {
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