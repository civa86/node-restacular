module.exports = {
    development: {
        driver: "sails-mongo",
        host: "localhost",
        port: "27017",
        username: "",
        password: "",
        database: "test-rest"
    },
    test: {
        driver: "mongodb",
        host: "localhost",
        port: "27017",
        username: "",
        password: "",
        database: "test-restacular"
    }
};