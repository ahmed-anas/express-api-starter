module.exports = {
    db: {
        mysql: {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'express_api_starter'
        }
    },
    jwtSecret: 'password',


    facebookAuth: {
        clientID: '<facebook_client_id>', 
        clientSecret: '<facebook_client_secret>', 
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        profileFields: ['emails', 'displayName', 'picture']
    },
    facebookRedirects: {
        success: 'http://localhost:4200/success',
        failure: 'http://localhost:4200/failure',
    },
    env: 'development'
}