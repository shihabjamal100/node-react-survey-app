const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    // Note that the user.id here refers to the _id in MongoDB as opposed to the googleId in the google profile
    // The reason we don't use the googleId is that in the future this app might use OAuth from Facebook or LinkedIn
    // etc so we can't assume that the user will always have a googleId.
    done(null, user.id); 
});

passport.deserializeUser((id, done) => {
    User.findById(id).then( (user) => {
        done(null, user);
    });
});
                         
passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        }, 
        (accesssToken, refreshToken, profile, done) => {
            User.findOne( {googleId: profile.id} ).then( (existingUser) => {
                if (existingUser)
                {
                    // We already have a record with the given profile id. No need to create new user.
                    done(null, existingUser);
                }
                else
                {
                    // We don't have a user with the given profile id
                    new User({ googleId: profile.id}).save().then( (user) => {
                        console.log('Calling done');
                        done(null, user);
                    });
                }
            });
        }
));