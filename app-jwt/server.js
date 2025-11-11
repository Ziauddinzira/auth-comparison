// app-jwt/server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
require('dotenv').config();
const connectDB = require('../shared/db');
const User = require('../shared/User');
connectDB();


app.use(express.json());

const users = []; // Mock DB

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    await User.create({ email, password: hashed, provider: "local" });
    res.send('User registered');
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).send('User not found');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).send('Wrong password');

    const token = jwt.sign({ id: user._id, email }, 'secretkey', { expiresIn: '1h' });

    res.json({ token });
});


app.get('/protected', (req, res) => {
    const header = req.headers.authorization;
    if (!header) return res.status(403).send('No token');
    try {
        const data = jwt.verify(header.split(' ')[1], 'secretkey');
        res.json({ message: 'Access granted', user: data });
    } catch {
        res.status(401).send('Invalid token');
    }
});

app.listen(4000, () => console.log('JWT app running on port 4000'));
