// app-zerotrust/server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const geoip = require('geoip-lite');
const app = express();
require('dotenv').config();
const connectDB = require('../shared/db');
const User = require('../shared/User');
connectDB();

app.use(express.json());

const secret = 'zerotrustkey';
const users = [{ username: 'admin', password: '1234' }];

function verifyRequest(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(403).send('No token');
    try {
        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, secret);

        // Get IP and Geo Info
        const ip = req.ip || req.connection.remoteAddress;
        const geo = geoip.lookup(ip) || {};
        if (decoded.allowedIP && decoded.allowedIP !== ip)
            return res.status(401).send('Suspicious IP detected');
        next();
    } catch (e) {
        res.status(401).send('Invalid request');
    }
}

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const ip = req.ip;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).send('User not found');

    if (password !== user.password)
        return res.status(401).send('Invalid credentials');

    const token = jwt.sign(
        { id: user._id, email, allowedIP: ip },
        secret,
        { expiresIn: '1h' }
    );

    res.json({ token });
});


app.get('/data', verifyRequest, (req, res) => res.json({ secure: true }));

app.listen(5000, () => console.log('Zero Trust app running on port 5000'));
