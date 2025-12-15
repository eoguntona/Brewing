const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
try {
    const { username, password } = req.body;

    const existing = await User.findOne({ username });
    if (existing) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        password: hashedPassword
    });

    res.status(201).json({
        message: 'User created',
        baristaId: user.baristaId
    });
    } catch (err) {
    res.status(500).json({ message: 'Server error' });
}
});

// LOGIN
router.post('/login', async (req, res) => {
try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({
        token,
        user: { username: user.username,
        baristaId: user.baristaId,
        totalMinutesStudied: user.totalMinutesStudied,
        badges: user.badges
        }
    });
} catch (err) {
    res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;
