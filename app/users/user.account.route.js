var express = require('express');
var router = express.Router();

var user = require('./user.controller');
var passport = require('passport');

var config = require('../../config/config');

var userModel = require('./user.model');
var url = require('url');

var userController = require('./user.controller');

router.get('/me', passport.authenticate('jwt', {session: false}), function(req, res, next){
    res.json(userModel.getSafeObject(req.user, userModel.ACCESS_LEVEL.THIS_USER_SAFE));
})

router.get('/:userId', passport.authenticate('jwt', {session: false}), userController.getUser);



module.exports = router;