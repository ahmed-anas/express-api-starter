var express = require('express');
var router = express.Router();

var user = require('./user.controller');
var passport = require('passport');

var config = require('../../config/config');

var userModel = require('./user.model');
var url = require('url');

router.post('/signup', user.signup);
router.post('/signin', user.signin);
router.get('/verify', user.verify);
router.post('/verify', user.verify);
router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));
router.get('/facebook/callback', passport.authenticate('facebook', {
    // successRedirect: config.facebookRedirects.success,
    failureRedirect: config.facebookRedirects.failure

}), function (req, res, next) {
    
    var parsedUrl = url.parse(config.facebookRedirects.success);
    parsedUrl.query = parsedUrl.query || {};
    parsedUrl.query.loginToken = userModel.getTokenAndPayload(req.user).token;
    parsedUrl.query.userId = req.user.userId
    
    let urlString = url.format(parsedUrl);
    res.redirect(urlString);
})

module.exports = router;