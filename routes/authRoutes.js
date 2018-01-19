const passport = require('passport');

module.exports = (app) => {
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
       })
    );
    
    app.get(
        '/auth/google/callback', 
        passport.authenticate('google'),
        (req, res) => {
            res.redirect('/surveys')        
        }
    );

    app.get('/api/logout', (req, res) => {
        // This logout function is added to the request object by 
        // the passport middleware. This functiion removes the cookie
        // which in effect logs the user out.
        req.logout(); 
        res.redirect('/');
    });

    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });
};