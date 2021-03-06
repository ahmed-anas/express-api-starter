var mysql = require('mysql');
var config = require('./config');
var pool = mysql.createPool(config.db.mysql);
var Sequelize = require('sequelize');

module.exports.getConnection = function () {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            return resolve(connection);
        })
    })
}


var sequelizeInstance = null;
module.exports.getSequelize = function () {
    if (!sequelizeInstance) {
        sequelizeInstance = new Sequelize(config.db.mysql.database, config.db.mysql.user, config.db.mysql.password, {
            host: config.db.mysql.host,
            dialect: 'mysql',

            pool: {
                max: 10,
                min: 0,
                idle: 10000
            },

        });
    }
    return sequelizeInstance;


}



function runSchemaWithCheck(fileName, checkQuery) {

    var fs = require('fs');

    return module.exports.getConnection()
        //check if tables already exist
        .then(connection => {
            return new Promise((resolve, reject) => {
                connection.query(checkQuery, function (err, results) {
                    resolve({
                        connection: connection,
                        results: results
                    })
                })
            })
        })
        //if tables don't exist, create em
        .then(data => {
            return new Promise((resolve, reject) => {
                let connection = data.connection;
                if (data.results && data.results.length) {
                    return resolve(connection);
                }
                try {
                    connection.query(fs.readFileSync(fileName).toString(), (err, results) => {
                        if (err) {
                            return reject(err);
                        }

                        resolve(connection);
                    });
                }
                catch (e) {
                    reject(e);
                }
            })
        })

        //release schema
        .then(connection => {
            connection.release();
        })
}



module.exports.initSchema = function () {
    return runSchemaWithCheck('./config/schema.sql', 'show TABLES');
}

module.exports.seedDb = function () {
    return runSchemaWithCheck('./config/db-seed.sql', 'select * from users limit 1');
}


