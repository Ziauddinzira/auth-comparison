// app-oauth2/server.js

import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { connectDB } from '../shared/db.js';
import User from '../shared/User.js';

await connectDB();

const app = express();

app.use(session({ secret: 'oauth2secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                provider: "google"
            });
        }
        return done(null, user);
    } catch (err) {
        return done(err);// app-oauth2/server.js

        import dotenv from 'dotenv';
        dotenv.config({ path: '../.env' });

        import express from 'express';
        import session from 'express-session';
        import passport from 'passport';
        import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
        import { connectDB } from '../shared/db.js';
        import User from '../shared/user.js';

        await connectDB();

        const app = express();

        app.use(session({ secret: 'oauth2secret', resave: false, saveUninitialized: true }));
        app.use(passport.initialize());
        app.use(passport.session());

        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: '/auth/google/callback'
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });
                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        provider: "google"
                    });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }));

        passport.serializeUser((user, done) => done(null, user));
        passport.deserializeUser((obj, done) => done(null, obj));

        app.get('/', (req, res) => {
            res.send(`
        <h2>OAuth2 App Running!</h2>
        <p>Try <a href="/auth/google">Login with Google</a></p>
    `);
        });

        app.get('/auth/google/callback',
            passport.authenticate('google', { failureRedirect: '/' }),
            (req, res) => {
                console.log("Access Token:", req.user?.accessToken || "not shown");
                res.send('Login Successful!');
            }
        );

        app.listen(3000, '0.0.0.0', () => console.log('OAuth2 app running on port 3000'));

    }
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
