
module.exports = (function () {
    var jugglingdb = require("jugglingdb"),
        store = null,
        entities = {},
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

    connect = function (config, done) {
        if (store) {
            disconnect();
        }

        store = new jugglingdb.Schema(config.driver, config);
        var connectionUrl = config.driver + "://" + config.host + "/" + config.database;
        console.log("[ORM SERVICE] connected to " + connectionUrl);
        done();
    }; 

    defineModel = function (model, done) {
        entities = model;
        for (var i in entities) {
            for(var s in entities[i].schema){
                if(s ===  i + "Id"){
                    throw new Error(i + "Id is a reserved field for " + i + " collection");
                } 
            }
            store.define(i, entities[i].schema);
            console.log("[ " + i + " ] Model Schema defined");
        }
        for(var j in entities) {
            if(entities[j]["relations"] && typeof entities[j]["relations"] === "object"){
                var model = store.models[j];
                
                for(var k in entities[j]["relations"]){
                    var targetModel = store.models[entities[j]["relations"][k]];
                    model[k](targetModel, {as: entities[j]["relations"][k]});
                    console.log("[ " + j + " ] " + k + " [ " + entities[j]["relations"][k] + " ]");
                }
            }
        }
        store.autoupdate(done);
    };

    findAll = function (entity, where, done) {
        try {
            var model = store.models[entity];
            if(!model){
                done({code: 404, message: "Entity ["+ entity + "] not found"}, null);
            }
            var w = (where) ? {where: where} : null;
            if (w && w.where) {
                for (var wh in w.where) {
                    console.log(w.where[wh]);
                    if (w.where[wh] === "true")
                        w.where[wh] = true;
                    else if (w.where[wh] === "false")
                        w.where[wh] = false;
                }
            }
            model.all(w, done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.findAll] " + entity}, null);
        }
    };

    findById = function (entity, id, done) {

    };

    count = function (entity, done) {

    };

    createRecord = function (entity, record, done) {

    };

    updateRecord = function (entity, id, record, done) {

    };

    deleteAll = function (entity, done) {

    };

    deleteById = function (entity, id, done) {

    };

    disconnect = function (done) {
        store.disconnect();
        store = null;
        done();
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
