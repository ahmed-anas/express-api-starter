var _ = require('lodash'),
    crypto = require('crypto'),
    db = require('../../config/db'),
    config = require('../../config/config');
var jwt = require("jsonwebtoken");

var UserModel = require('./user.sequelize.model');

var userCreateableFields = [
    'email',
    'displayName',
    'password',
    'facebookId',
    'pictureUrl'
];


module.exports.ACCESS_LEVEL = {
    OTHER_USERS: [
        'userId',
        'displayName',
        'email',
        'role',
        'pictureUrl'
    ],
    THIS_USER_SAFE: [
        'userId',
        'email',
        'displayName',
        'role',
        'pictureUrl'

    ]
};


function hashPassword(password, salt) {
    if (salt && password && password.length > 3) {
        return crypto.pbkdf2Sync(password, new Buffer(salt, 'base64'), 10000, 64, 'sha512').toString('base64');
    } else {
        return password;
    }
}


function getTokenAndPayload(user) {
    var payload = { userId: user.userId, role: user.role };
    var token = jwt.sign(payload, config.jwtSecret, { expiresIn: 5000 });
    return {
        token: token,
        payload: payload
    };
}

module.exports.getTokenAndPayload = getTokenAndPayload;

module.exports.getSafeObject = function (userObj, ACCESS_LEVEL) {
    return _.pick(userObj, ACCESS_LEVEL || module.exports.ACCESS_LEVEL.THIS_USER_SAFE);
}
module.exports.hashPassword = hashPassword;


module.exports.getUser = function (userObj, ACCESS_LEVEL = module.exports.ACCESS_LEVEL.OTHER_USERS) {

    userObj.password && delete userObj.password;
    userObj.salt && delete userObj.salt;
    return UserModel.findOne({

        attributes: ACCESS_LEVEL || undefined,
        where: userObj
    });
}


module.exports.getUserById = function (userId, ACCESS_LEVEL = module.exports.ACCESS_LEVEL.OTHER_USERS) {
    return module.exports.getUser({
        userId: userId
    }, ACCESS_LEVEL);

}



module.exports.createUser = function (userObj) {


    var safeObj = _.pick(userObj, userCreateableFields);

    if (Object.keys(safeObj).length <= 0) {
        return Promise.reject(new Error('No valid fields given'));
    }

    safeObj.role = 'member';

    if (safeObj.password) {
        safeObj.salt = crypto.randomBytes(16).toString('base64');
        safeObj.password = hashPassword(safeObj.password, safeObj.salt);
    }
    return UserModel.create(safeObj);



}