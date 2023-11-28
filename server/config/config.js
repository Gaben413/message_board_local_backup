const fs = require('fs');

module.exports = {    
    development: {
        username: "root",
        password: "Orion2014!",
        database: "4chan_db_test2",
        host: "127.0.0.1",
        dialect: "mariadb",
        port: 3307
    },
    test: {
        username: "root",
        password: "Orion2014!",
        database: "4chan_db_test2",
        host: "127.0.0.1",
        dialect: "mariadb",
        port: 3307
    },
    production: {
        username: "root",
        password: "Orion2014!",
        database: "4chan_db_test2",
        host: "127.0.0.1",
        dialect: "mariadb",
        port: 3307
    }
}