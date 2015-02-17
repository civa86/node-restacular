var mongoose = require("mongoose");

module.exports = {
    /*
     * Connect
     */
    connect: function(config, done) {
        var connectionUrl = config.driver + "://" + config.host + "/" + config.database;
        mongoose.connect(connectionUrl);
        console.log("[ORM SERVICE] connected to " + connectionUrl);
        done();
    },
    
    defineModel: function(model, done) {
        mongoose.model("dario", new mongoose.Schema(
            {
                name: String
            },
        {
            collection: 'calendar',
            versionKey: false
        }
        ));
        done();
    },
    findAll: function(entity, where, done) {
        try {
            var model = mongoose.model(entity);
            var w = where || {};
            model.find(w, done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.findAll] " + entity}, null);
        }


    },
    findById: function(entity, id, done) {
        try {
            var model = mongoose.model(entity);
            model.findById(id, done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.findAll] " + entity}, null);
        }
    },
    count: function(entity, done) {
        try {
            var model = mongoose.model(entity);
            model.count({}, done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.count] " + entity}, null);
        }
    },
    createRecord: function(entity, record, done) {
        try {
            var model = mongoose.model(entity);
            var rec = new model(record);
            rec.save(done);
        }
        catch (e) {
            done({code: 404, message: "[Error::ormService.createRecord] " + entity}, null);
        }
    },
    updateRecord: function(entity, id, record, done) {
        try {
            var model = mongoose.model(entity);
            model.findByIdAndUpdate(id, record, {}, done);
        }
        catch (e) {
            done({code: 404, message: "[Error::ormService.updateRecord] " + entity}, null);
        }
    },
    deleteAll: function(entity, done) {
        try {
            var model = mongoose.model(entity);
            model.remove({}, done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.deleteAll] " + entity}, null);
        }
    },
    deleteById: function(entity, id, done) {
        try {
            var model = mongoose.model(entity);
            model.findByIdAndRemove(id, {}, done);
        }
        catch (e) {
            done({code: 500, message: "[Error::ormService.deleteAll] " + entity}, null);
        }
    },
    disconnect: function(done) {
        mongoose.disconnect(function() {
            console.log("[ORM SERVICE] disconnected");
            done();
        });

    }



};
