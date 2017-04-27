'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    userModel = require('../../app/users/user.model');


module.exports = function () {
    // Use local strategy
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        function (email, password, done) {
            userModel.getUser({
                email: email
            }, false).then(user => {
                if (!user) {
                    return done(new Error('Invalid email/password combination'));
                }

                if (user.password === userModel.hashPassword(password, user.salt)) {
                    return done(null, userModel.getSafeObject(user));
                }
                return done(new Error('Invalid email/password combination'));

            })
                .catch(err => {
                    return done(err);
                })


        }
    ));
};
