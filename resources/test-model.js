module.exports = {
    post: {
        title: {
            type: 'string',
            required: true
        },
        description: 'text',

        behaviours: {
            beforeCreate: function(values, next){
                values.title = values.title + "_beforeCreate_executed";
                next();
            }
        }
    },
    comment: {
        text: 'text'
    }
};
