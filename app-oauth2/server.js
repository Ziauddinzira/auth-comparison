// app-oauth2/server.js
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const connectDB = require('../shared/db');
const User = require('../shared/User');
connectDB();


const app = express();

app.use(session({ secret: 'oauth2secret' }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
        user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            provider: "google"
        });
    }

    return done(null, user);
}));


passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => res.send('Login Successful!')
);

app.listen(3000, () => console.log('OAuth2 app running on port 3000'));
