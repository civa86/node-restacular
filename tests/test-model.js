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

//TODO check how to do with properties....function by user etc...
//attributes type:
//string
//text
//integer
//float
//date
//time
//datetime
//boolean
//binary
//array
//json
