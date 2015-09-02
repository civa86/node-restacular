module.exports = {
    development: {
        adapter: require("sails-mongo"),
        host: "localhost",
        port: "27017",
        username: "",
        password: "",
        database: "test-rest"
    },
    test: {
        adapter: require("sails-mongo"),
        host: "localhost",
        port: "27017",
        username: "",
        password: "",
        database: "test-restacular"
    }
};