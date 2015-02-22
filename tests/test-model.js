module.exports = function (orm, schema, done) {
    
    orm.define("post", {
        title: String,
        description: schema.Text
    });

    done();
};