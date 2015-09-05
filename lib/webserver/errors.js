module.exports = (function() {
    var handle404,
        handleGenericError;


    handle404 = function(req, res) {
        res.status(404);
        res.send(JSON.stringify({code: 404, message: "Not Found!"}));
    };

    handleGenericError = function(err, res) {
        var status = (typeof err.code === "number") ? err.code : 500;
        res.status(status);
        res.send(JSON.stringify({code: status, message: err.message}));
    };

    return {
        handle404: handle404,
        handleGenericError: handleGenericError
    };

})();
