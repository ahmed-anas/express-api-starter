var db = require('../../config/db')
var sequelize = db.getSequelize();
var Sequelize = require('sequelize');

var User = sequelize.define('Users', {
    userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    facebookId: {
        type: Sequelize.BIGINT.UNSIGNED,
    },
    displayName: {
        type: Sequelize.STRING(64),
    },
    email: {
        type: Sequelize.STRING(300),
    },
    password: {
        type: Sequelize.STRING(128),
    },
    salt: {
        type: Sequelize.STRING(128),
    },
    pictureUrl: {
        type: Sequelize.TEXT
    },
    role: {
        type: Sequelize.ENUM,
        values: ['member', 'business'],

    }

}, {
        indexes: [
            {
                unique: true,
                fields: ['facebookId']
            },
            {
                fields: ['role']
            }
        ]
    });

module.exports = User;