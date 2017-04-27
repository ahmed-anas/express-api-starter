'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    userModel = require('../../app/users/user.model');
var FacebookStrategy = require('passport-facebook').Strategy;

var config = require('../config');



module.exports = function () {
    passport.serializeUser(function (user, done) {
        done(null, user.userId);
    })
    passport.deserializeUser(function (userId, done) {
        userModel.getUserById(userId).then(function (user) {
            if (!user) {
                return done(new Error('Invalid user id'), null);
            }

            return done(null, user);

        })
    })

    passport.use(new FacebookStrategy(config.facebookAuth, function (token, refreshToken, profile, done) {
        process.nextTick(() => {
            userModel.getUser({ facebookId: profile.id }).then(user => {



                if (user) {
                    return done(null, user);
                }
                else {
                    //profile token not stored
                    let userObj = {
                        email: profile.emails[0].value,
                        displayName: profile.displayName || ((profile.name.givenName || '')+ ' ' + (profile.name.familyName || '')),
                        facebookId: profile.id,
                        pictureUrl: (profile.photos && profile.photos[0])?profile.photos[0].value:null
                    };


                    userModel.createUser(userObj)
                        // .then(userModel.getUserById)
                        .then(user => {
                            return done(null, user);
                        }).catch(err => {
                            return done(err);
                        })
                }
            })
                .catch(err => {
                    return done(err);
                })
        })
    }))

};
