//TODO follow example and implement base CRUD
//EXAMPLE https://github.com/balderdashy/waterline/blob/master/example/express/express-example.js

//GENERIC DOCS: https://github.com/balderdashy/waterline-docs

//TODO implement dataTypes: https://github.com/balderdashy/waterline-docs/blob/master/models/data-types-attributes.md

//TODO implement associations: https://github.com/balderdashy/waterline-docs/blob/master/models/associations/associations.md

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

    loadModel = function(entity, done) {
        var model = ormModels[entity];
        if (!model) {
            done({code: 404, message: "Entity [" + entity + "] not found"}, null);
        }
        else {
            return model;
        }
    };

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
                if (err) {
                    throw err;
                }

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
            var model = loadModel(entity, done);
            var m = model.find();

            //SORTING
            if(qs && qs.sort){
                try{
                    var sortCriteria = JSON.parse(qs.sort);
                    m.sort(sortCriteria);
                }
                catch(e){
                    errorMsg.push("[Query String Error] SORT is not a valid object");
                }
            }

            //PAGINATION
            if(qs && qs.paginate){
                try{
                    var pagination = JSON.parse(qs.paginate);
                    m.paginate(pagination);
                }
                catch(e){
                    errorMsg.push("[Query String Error] PAGINATE is not a valid object");
                }
            }

            //FILTERING
            if(qs && qs.where){
                try{
                    var whereCondition = JSON.parse(qs.where);
                    m.where(whereCondition);
                }
                catch(e){
                    errorMsg.push("[Query String Error] WHERE is not a valid object");
                }
            }

            //TODO check populate for associations....
            https://github.com/balderdashy/waterline-docs/blob/master/queries/query.md#populate

            if(errorMsg.length === 0){
                m.exec(done);
            }
            else{
                done({code: 500, message: errorMsg.join(", ")}, null);
            }

        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.findAll] " + entity}, null);
        }
    };

    findById = function (entity, id, done) {
        try {
            var model = loadModel(entity, done);
            model.findOne({ id: id }, done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.findAll] " + entity}, null);
        }
    };

    count = function (entity, done) {
        try {
            var model = loadModel(entity, done);
            model.count(done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.findAll] " + entity}, null);
        }
    };

    createRecord = function (entity, record, done) {
        try {
            var model = loadModel(entity, done);
            model.create(record, done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.findAll] " + entity}, null);
        }
    };

    updateRecord = function (entity, id, record, done) {
        try {
            if(record.id){
                delete record.id;
            }
            var model = loadModel(entity, done);
            model.update({id: id}, record, done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.findAll] " + entity}, null);
        }
    };

    deleteAll = function (entity, done) {
        try {
            var model = loadModel(entity, done);
            model.destroy(done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.findAll] " + entity}, null);
        }
    };

    deleteById = function (entity, id, done) {
        try {
            var model = loadModel(entity, done);
            model.destroy({ id: id }, done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.findAll] " + entity}, null);
        }
    };

    disconnect = function (done) {
        orm = new waterline();
        ormCfg = {};
        store = null;
        entities = {};
        ormModels = null;
        ormConnections = null;

        if (done && done === Function) {
            done();
        }
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
