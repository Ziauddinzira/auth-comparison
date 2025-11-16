// app-zerotrust/server.js

// load environment variables
require('dotenv').config({ path: '../.env' });

// connect to DB
const { connectDB } = require('../shared/db');
connectDB();

const express = require('express');
const jwt = require('jsonwebtoken');
const geoip = require('geoip-lite');
const User = require('../shared/user');

const app = express();
app.use(express.json());

const SECRET = process.env.ZEROTRUST_SECRET || 'zerotrustkey';

// middleware: verify request
function verifyRequest(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(403).send('No token');
    const parts = header.split(' ');
    if (parts.length !== 2) return res.status(401).send('Invalid authorization header format');
    const token = parts[1];
    try {
        const decoded = jwt.verify(token, SECRET);

        const ip = req.ip || req.connection.remoteAddress;
        const geo = geoip.lookup(ip) || {};
        // optional: you can log the geo info if needed
        // console.log('Request from IP:', ip, 'geo:', geo);

        if (decoded.allowedIP && decoded.allowedIP !== ip) {
            return res.status(401).send('Suspicious IP detected');
        }

        // attach user info to req if needed
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token/middleware error:', err);
        res.status(401).send('Invalid request');
    }
}

// login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    if (!email || !password) {
        return res.status(400).send('Email and password required');
    }
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).send('User not found');

        // Assuming user.password is stored hashed or plain: adapt accordingly
        // If hashed, use bcrypt.compare(...) likewise in JWT app
        if (password !== user.password) {
            return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign({ id: user._id, email, allowedIP: ip }, SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send('Internal server error');
    }
});

// secure data route
app.get('/data', verifyRequest, (req, res) => {
    // You could send back user info via req.user
    res.json({ secure: true, user: req.user });
});

app.use(express.static('public'));


const PORT = process.env.PORT || 4000;
app.listen(4000, '0.0.0.0', () => console.log(`Zero Trust app running on port ${PORT}`));
