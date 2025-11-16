// app-jwt/server.js

// load environment variables
require('dotenv').config({ path: '../.env' });

// connect to DB
const { connectDB } = require('../shared/db');
connectDB();

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../shared/user');

const app = express();
app.use(express.json());

// register route
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password required');
    }
    try {
        const hashed = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashed, provider: 'local' });
        res.send('User registered');
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).send('Internal server error');
    }
});

// login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password required');
    }
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).send('User not found');

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).send('Wrong password');

        const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send('Internal server error');
    }
});

// protected route
app.get('/protected', (req, res) => {
    const header = req.headers.authorization;
    if (!header) return res.status(403).send('No token');
    const parts = header.split(' ');
    if (parts.length !== 2) return res.status(401).send('Invalid authorization header format');
    const token = parts[1];
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        res.json({ message: 'Access granted', user: data });
    } catch (err) {
        console.error('Token verify error:', err);
        res.status(401).send('Invalid token');
    }
});

app.use(express.static('public'));


const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => console.log(`JWT app running on port ${PORT}`));
