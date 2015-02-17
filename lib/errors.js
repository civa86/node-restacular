module.exports = (function() {
    var handle404,
        handleGenericError;


    handle404 = function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    };

    handleGenericError = function(err, req, res, next) {
        var status = err.status || 500;
        res.status(status);
        res.send(JSON.stringify({status: status, message: err.message}));
    };

    return {
        handle404: handle404,
        handleGenericError: handleGenericError
    };

})();
