//EXAMPLE https://github.com/balderdashy/waterline/blob/master/example/express/express-example.js
//TODO follow example and implement base CRUD
module.exports = (function () {
    var waterline = require('waterline'),
        orm = new waterline(),
        ormCfg = {},
        store = null,
        entities = {},
        ormModels = null,
        ormConnections = null,

    //Methods
        connect,
        defineModel,
        findAll,
        findById,
        count,
        createRecord,
        updateRecord,
        deleteAll,
        deleteById,
        disconnect;

    connect = function (config, model, done) {
        ormCfg = {
            adapters: {},
            connections: {},
            defaults: {
                migrate: 'alter'
            }
        };

        var a = null;
        try {
            a = require(config.driver);
        }
        catch (e) {
            throw new Error("Adapter '" + config.driver + "' not found in node_modules");
        }

        ormCfg.adapters.default = a;
        ormCfg.connections.defaultConnection = {
            adapter: 'default',
            host: config.host,
            port: config.port,
            user: config.username,
            password: config.password,
            database: config.database
        };


        store = defineModel(model, function () {

            orm.initialize(ormCfg, function (err, models) {
                if (err) throw err;

                ormModels = models.collections;
                ormConnections = models.connections;

                var connectionUrl = config.driver + "://" + config.host + ":" + config.port + "/" + config.database;
                console.log("[ORM SERVICE] connected to " + connectionUrl);
                done();
            });

        });


    };

    defineModel = function (model, done) {
        if (model) {
            for (var i in model) {
                entities[i] = waterline.Collection.extend({
                    identity: i,
                    connection: 'defaultConnection',
                    attributes: model[i]
                });
            }

            for (var e in entities) {
                orm.loadCollection(entities[e]);
            }
            done();
        }
        else {
            done();
        }
    };

    findAll = function (entity, where, done) {
        try {
            //var model = store.models[entity];
            //if (!model) {
            //    done({code: 404, message: "Entity [" + entity + "] not found"}, null);
            //}
            //var w = (where) ? {where: where} : null;
            //if (w && w.where) {
            //    for (var wh in w.where) {
            //        console.log(w.where[wh]);
            //        if (w.where[wh] === "true")
            //            w.where[wh] = true;
            //        else if (w.where[wh] === "false")
            //            w.where[wh] = false;
            //    }
            //}
            //model.all(w, done);
            //TODO do where condition etc...
            var model = ormModels[entity];
            model.find().exec(done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.findAll] " + entity}, null);
        }
    };

    findById = function (entity, id, done) {
        try {
            var model = store.models[entity];
            if (!model) {
                done({code: 404, message: "Entity [" + entity + "] not found"}, null);
            }
            model.find(id, done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.findAll] " + entity}, null);
        }
    };

    count = function (entity, done) {
        try {
            var model = store.models[entity];
            if (!model) {
                done({code: 404, message: "Entity [" + entity + "] not found"}, null);
            }
            model.count(done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.findAll] " + entity}, null);
        }
    };

    createRecord = function (entity, record, done) {
        try {
            var model = store.models[entity];
            if (!model) {
                done({code: 404, message: "Entity [" + entity + "] not found"}, null);
            }
            var m = new model(record);
            m.save(done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.findAll] " + entity}, null);
        }
    };

    updateRecord = function (entity, id, record, done) {
        try {
            var model = store.models[entity];
            if (!model) {
                done({code: 404, message: "Entity [" + entity + "] not found"}, null);
            }
            model.find(id, function (err, result) {
                if (err) {
                    done({code: 500, message: JSON.stringify(err)}, null);
                }
                if (!result) {
                    done({code: 404, message: "Record not found"}, null);
                }
                for (var p in record) {
                    if (result[p] !== undefined) {
                        result[p] = record[p];
                    }
                }
                result.save(done);
            });
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.findAll] " + entity}, null);
        }
    };

    deleteAll = function (entity, done) {
        try {
            var model = store.models[entity];
            if (!model) {
                done({code: 404, message: "Entity [" + entity + "] not found"}, null);
            }
            model.destroyAll(done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.findAll] " + entity}, null);
        }
    };

    deleteById = function (entity, id, done) {
        try {
            var model = store.models[entity];
            if (!model) {
                done({code: 404, message: "Entity [" + entity + "] not found"}, null);
            }
            model.find(id, function (err, result) {
                if (err) {
                    done({code: 500, message: JSON.stringify(err)}, null);
                }
                if (!result) {
                    done({code: 404, message: "Record not found"}, null);
                }
                result.destroy(done);
            });
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.findAll] " + entity}, null);
        }
    };

    disconnect = function (done) {
        //store.disconnect();
        store = null;
        if (done && done === Function) {
            done();
        }
    };

    return {
        connect: connect,
        defineModel: defineModel,
        findAll: findAll,
        findById: findById,
        count: count,
        createRecord: createRecord,
        updateRecord: updateRecord,
        deleteAll: deleteAll,
        deleteById: deleteById,
        disconnect: disconnect
    };

})();
