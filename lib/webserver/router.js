module.exports = (function () {
    var express = require("express"),
        router = express.Router(),
        ormFactory = require('../orm/ormFactory'),
        errors = require('./errors'),

    //Private Methods
        sendData,
        sendResponse,
        emptyRecord,

    //Public Methods
        create;

    sendData = function (result, res) {
        res.status(200);
        res.send(JSON.stringify({code: 200, message: result}));
    };

    sendResponse = function (res, err, result) {
        if (result !== null && result !== undefined) {
            sendData(result, res);
        }
        else {
            if (err) {
                errors.handleGenericError(err, res);
            }
            else {
                errors.handleGenericError({code: 404, message: "Record not found"}, res);
            }
        }
    };

    emptyRecord = function (rec) {
        return Object.keys(rec).length === 0;
    };

    create = function (done) {
        ormFactory.initService(function (err) {
            if (err) {
                done(err, null);
            }
            else {
                router.get('/', function (req, res) {
                    sendResponse(res, null, "Welcome to NODE-RESTacular api service");
                });

                //GET METHODS
                router.get('/:entity', function (req, res) {
                    var entity = req.params.entity;
                    var qs = req.query;

                    var orm = ormFactory.getInstance(entity);
                    orm.findAll(entity, qs, function (err, result) {
                        sendResponse(res, err, result);
                    });
                });

                router.get('/:entity/count', function (req, res) {
                    var entity = req.params.entity;
                    var orm = ormFactory.getInstance(entity);
                    orm.count(entity, function (err, result) {
                        sendResponse(res, err, result);
                    });
                });

                router.get('/:entity/:id', function (req, res) {
                    var entity = req.params.entity;
                    var id = req.params.id;
                    var orm = ormFactory.getInstance(entity);
                    orm.findById(entity, id, function (err, result) {
                        sendResponse(res, err, result);
                    });
                });

                //POST METHODS
                router.post('/:entity', function (req, res) {
                    var entity = req.params.entity;
                    var record = req.body;
                    if (record && typeof record === "object" && !emptyRecord(record)) {
                        var orm = ormFactory.getInstance(entity);
                        orm.createRecord(entity, record, function (err, result) {
                            sendResponse(res, err, result);
                        });
                    }
                    else {
                        sendResponse(res, {code: 406, message: "No record to create"}, null);
                    }

                });

                //PUT METHODS
                router.put('/:entity/:id', function (req, res) {
                    var entity = req.params.entity;
                    var id = req.params.id;
                    var record = req.body;
                    if (record && typeof record === "object" && !emptyRecord(record)) {
                        var orm = ormFactory.getInstance(entity);
                        orm.updateRecord(entity, id, record, function (err, result) {
                            sendResponse(res, err, result);
                        });
                    }
                    else {
                        sendResponse(res, {code: 406, message: "No record to update"}, null);
                    }

                });

                //DELETE METHODS
                router.delete('/:entity', function (req, res) {
                    var entity = req.params.entity;
                    var orm = ormFactory.getInstance(entity);
                    orm.deleteAll(entity, function (err) {
                        var result = (err === null) ? "delete success /" + entity : undefined;
                        sendResponse(res, err, result);
                    });

                });

                router.delete('/:entity/:id', function (req, res) {
                    var entity = req.params.entity;
                    var id = req.params.id;
                    var orm = ormFactory.getInstance(entity);
                    orm.deleteById(entity, id, function (err) {
                        var result = (err === null) ? "delete success /" + entity + "/" + id : undefined;
                        sendResponse(res, err, result);
                    });

                });

                done(null, router);
            }
        });
    };

    return {
        create: create
    };

})();
