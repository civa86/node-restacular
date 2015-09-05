//WATERLINE DOCS: https://github.com/balderdashy/waterline-docs

//TODO document dataTypes: https://github.com/balderdashy/waterline-docs/blob/master/models/data-types-attributes.md
//TODO implement/document associations: https://github.com/balderdashy/waterline-docs/blob/master/models/associations/associations.md

module.exports = (function () {
    var waterline = require('waterline'),
        orm = new waterline(),
        ormCfg = {},
        store = null,
        entities = {},
        ormModels = null,
        ormConnections = null,

    //Private Methods
        defineModel,
        loadModel,
        manageError,

    //Public Methods
        connect,
        findAll,
        findById,
        count,
        createRecord,
        updateRecord,
        deleteAll,
        deleteById,
        disconnect;

    defineModel = function (model, done) {
        for (var i in model) {

            var entityObject = {
                identity: i,
                connection: 'defaultConnection',
                schema: true,
                migrate: 'alter'
            };
            if (model[i].behaviours && model[i].behaviours.constructor === Object) {
                for (var b in model[i].behaviours) {
                    //TODO check on permitted behaviors
                    entityObject[b] = model[i].behaviours[b];
                }
                delete model[i].behaviours;
            }
            entityObject.attributes = model[i];

            entities[i] = waterline.Collection.extend(entityObject);
        }

        for (var e in entities) {
            orm.loadCollection(entities[e]);
        }
        done();
    };

    manageError = function (e, done) {
        done({code: e.code, message: e.message}, null);
    };

    loadModel = function (entity) {
        var model = ormModels[entity],
            error;
        if (!model) {
            error = new Error("Entity [" + entity + "] not found");
            error.code = 404;
            throw error;
        }
        else {
            return model;
        }
    };

    connect = function (config, model, done) {
        //TODO implement array of adapters....
        ormCfg = {
            adapters: {},
            connections: {},
            defaults: {
                migrate: 'alter'
            },
            adapters: {
                default: config.adapter
            },
            connections: {
                defaultConnection: {
                    adapter: 'default',
                    host: config.host,
                    port: config.port,
                    user: config.username,
                    password: config.password,
                    database: config.database
                }
            }
        };


        store = defineModel(model, function () {

            orm.initialize(ormCfg, function (err, models) {
                ormModels = models.collections;
                ormConnections = models.connections;

                var connectionUrl = config.driver + "://" + config.host + ":" + config.port;
                console.log("[ORM SERVICE] connected to " + connectionUrl + ", using database " + config.database);
                done();
            });

        });


    };

    findAll = function (entity, qs, done) {
        try {
            var errorMsg = [];
            var model = loadModel(entity);
            var m = model.find();

            //SORTING
            if (qs && qs.sort) {
                try {
                    var sortCriteria = JSON.parse(qs.sort);
                    m.sort(sortCriteria);
                }
                catch (e) {
                    errorMsg.push("[Query String Error] SORT is not a valid object");
                }
            }

            //PAGINATION
            if (qs && qs.paginate) {
                try {
                    var pagination = JSON.parse(qs.paginate);
                    m.paginate(pagination);
                }
                catch (e) {
                    errorMsg.push("[Query String Error] PAGINATE is not a valid object");
                }
            }

            //FILTERING
            if (qs && qs.where) {
                try {
                    var whereCondition = JSON.parse(qs.where);
                    m.where(whereCondition);
                }
                catch (e) {
                    errorMsg.push("[Query String Error] WHERE is not a valid object");
                }
            }

            //JOIN ASSOCIATIONS
            if (qs && qs.join) {
                try {
                    var joinEntities = qs.join.split(",");
                    for (var i = 0; i < joinEntities.length; i++) {
                        m.populate(joinEntities[i]);
                    }
                }
                catch (e) {
                    errorMsg.push("[Query String Error] JOIN is not a valid string OR relation");
                }
            }

            if (errorMsg.length === 0) {
                m.exec(done);
            }
            else {
                done({code: 500, message: errorMsg.join(", ")}, null);
            }

        }
        catch (e) {
            manageError(e, done);
        }
    };

    findById = function (entity, id, done) {
        try {
            var model = loadModel(entity);
            model.findOne({id: id}, done);
        }
        catch (e) {
            manageError(e, done);
        }
    };

    count = function (entity, done) {
        try {
            var model = loadModel(entity);
            model.count(done);
        }
        catch (e) {
            manageError(e, done);
        }
    };

    createRecord = function (entity, record, done) {
        try {
            var model = loadModel(entity);
            model.create(record, done);
        }
        catch (e) {
            manageError(e, done);
        }
    };

    updateRecord = function (entity, id, record, done) {
        try {
            if (record.id) {
                delete record.id;
            }
            var model = loadModel(entity);
            model.update({id: id}, record, done);
        }
        catch (e) {
            manageError(e, done);
        }
    };

    deleteAll = function (entity, done) {
        try {
            var model = loadModel(entity);
            model.destroy(done);
        }
        catch (e) {
            manageError(e, done);
        }
    };

    deleteById = function (entity, id, done) {
        try {
            var model = loadModel(entity);
            model.destroy({id: id}, done);
        }
        catch (e) {
            manageError(e, done);
        }

    };

    disconnect = function () {
        orm = new waterline();
        ormCfg = {};
        store = null;
        entities = {};
        ormModels = null;
        ormConnections = null;

        return true;
    };

    return {
        connect: connect,
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
