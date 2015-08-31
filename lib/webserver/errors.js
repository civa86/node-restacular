module.exports = (function() {
    var handle404,
        handleGenericError;


    handle404 = function(res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    };

    handleGenericError = function(err, res) {
        var status = err.code || 500;
        res.send(JSON.stringify({code: status, message: err.message}));
    };

    return {
        handle404: handle404,
        handleGenericError: handleGenericError
    };

})();
