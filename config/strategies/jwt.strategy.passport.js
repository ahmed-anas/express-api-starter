var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    passport = require('passport'),
    userModel = require('../../app/users/user.model');
    
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();

ExtractJwt.fromBodyField('token');

module.exports = function(){
    opts.secretOrKey = require('../config').jwtSecret;

    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

        if(!jwt_payload.userId){

            process.nextTick(function(){
                done(null, "Invalid Token Payload");
            })
        }
        else 
        {
            userModel.getUserById(jwt_payload.userId, null).then(user => {
                if(user){
                    done(null, user);
                } 
                else {
                    done({
                        message: 'Unknown error. Bad data',
                        status: 401
                    }, false);
                }
                return null;
            })
            .catch(err => {
                return done(err, false);
            })
        }
    }))
}