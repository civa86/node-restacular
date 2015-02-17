module.exports = (function() {
    var express = require("express"),
        router = express.Router(),
        ormFactory = require('./orm/ormFactory'),
        //Methods
        sendError,
        sendData,
        sendResponse,
        create;

    sendError = function(err, res) {
        res.status(err.code);
        res.send(JSON.stringify({code: err.code, message: err}));
    };
    sendData = function(result, res) {
        res.status(200);
        res.send(JSON.stringify({code: 200, message: result}));
    };

    sendResponse = function(res, err, result) {
        if (err !== null && err !== undefined) {
            sendError(err, res);
        }
        else if (result !== null && result !== undefined) {
            sendData(result, res);
        }
        else {
            sendError({code: 500, message: "generic error"}, res);
        }
    };

    create = function(done) {
        ormFactory.initService(function() {
            router.get('/', function(req, res) {
                res.render("index", {msg: "Welcome to rest service"});
            });

            //GET METHODS
            router.get('/:entity', function(req, res) {
                var entity = req.params.entity;
                var where = req.query || null;
                
                var orm = ormFactory.getInstance(entity);
                orm.findAll(entity, where, function(err, result) {
                    sendResponse(res, err, result);
                });
            });

            router.get('/:entity/count', function(req, res) {
                var entity = req.params.entity;
                var orm = ormFactory.getInstance(entity);
                orm.count(entity, function(err, result) {
                    sendResponse(res, err, result);
                });
            });

            router.get('/:entity/:id', function(req, res) {
                var entity = req.params.entity;
                var id = req.params.id;
                var orm = ormFactory.getInstance(entity);
                orm.findById(entity, id, function(err, result) {
                    sendResponse(res, err, result);
                });
            });
//
//            router.get('/:entity/:id/:relation', function(req, res) {
//                var entity = req.params.entity;
//                var id = req.params.id;
//                var relation = req.params.relation;
//
//                dao.findEntityRelation(entity, id, relation, function(err, result) {
//                    sendResponse(res, err, result);
//                });
//            });

            //POST METHODS
            router.post('/:entity', function(req, res) {
                var entity = req.params.entity;
                var record = req.body;
                if (record && typeof record === "object") {
                    var orm = ormFactory.getInstance(entity);
                    orm.createRecord(entity, record, function(err, result) {
                        sendResponse(res, err, result);
                    });
                }
                else {
                    sendResponse(res, {code: 404, message: "No record to create"}, null);
                }

            });

            //    router.post('/:entity/:id/:relation', function(req, res) {
//        var entity = req.params.entity;
//        var id = req.params.id;
//        var relation = req.params.relation;
//        var record = req.body;
//
//        if (record && typeof record === "object") {
//            dao.createEntityRelation(entity, id, relation, record, function(err, result) {
//                sendResponse(res, err, result);
//            });
//        }
//        else {
//            sendResponse(res, {code: 404, message: "No record to create"}, null);
//        }
//
//    });

            //PUT METHODS
            router.put('/:entity/:id', function(req, res) {
                var entity = req.params.entity;
                var id = req.params.id;
                var record = req.body;
                if (record && typeof record === "object") {
                    var orm = ormFactory.getInstance(entity);
                    orm.updateRecord(entity, id, record, function(err, result) {
                        sendResponse(res, err, result);
                    });
                }
                else {
                    sendResponse(res, {code: 404, message: "No record to create"}, null);
                }

            });

            //DELETE METHODS
            router.delete('/:entity', function(req, res) {
                var entity = req.params.entity;
                var orm = ormFactory.getInstance(entity);
                orm.deleteAll(entity, function(err, result) {
                    sendResponse(res, err, "delete success " + entity);
                });

            });
            
            router.delete('/:entity/:id', function(req, res) {
                var entity = req.params.entity;
                var id = req.params.id;
                var orm = ormFactory.getInstance(entity);
                orm.deleteById(entity, id, function(err, result) {
                    sendResponse(res, err, "delete success " + entity + "/" + id);
                });

            });


            done(router);

        });





    };

    return {
        create: create
    };

})();
