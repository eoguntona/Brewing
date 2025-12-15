const express = require('express');
const Session = require('../Models/Session');
const User = require('../Models/User');

const router = express.Router();

// CREATE SESSION
router.post('/', async (req, res) => {
try {
    const { userId, durationMinutes } = req.body;

    const session = await Session.create({
        host: userId,
        participants: [userId],
        durationMinutes
    });

    res.status(201).json(session);
    } catch (err) {
    res.status(500).json({ message: 'Could not create session' });
}
});

// JOIN SESSION
router.post('/join', async (req, res) => {
try {
    const { baristaId, sessionId } = req.body;

    const user = await User.findOne({ baristaId });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const session = await Session.findById(sessionId);
    if (!session || !session.isActive) {
        return res.status(400).json({ message: 'Session not available' });
    }

    if (!session.participants.includes(user._id)) {
        session.participants.push(user._id);
        await session.save();
    }

    res.json(session);
} catch (err) {
    res.status(500).json({ message: 'Could not join session' });
}
});

// END SESSION
router.patch('/end', async (req, res) => {
try {
    const { sessionId } = req.body;

    const session = await Session.findById(sessionId).populate('participants');
    if (!session || !session.isActive) {
        return res.status(400).json({ message: 'Session already ended' });
    }

    session.isActive = false;
    await session.save();

    for (let user of session.participants) {
        user.totalMinutesStudied += session.durationMinutes;

        if (user.totalMinutesStudied >= 60 && !user.badges.includes('espresso')) {
            user.badges.push('espresso');
        }

        if (user.totalMinutesStudied >= 180 && !user.badges.includes('latte')) {
            user.badges.push('latte');
        }

    await user.save();
    }

    res.json({ message: 'Session ended and progress saved' });
    } catch (err) {
        res.status(500).json({ message: 'Could not end session' });
    }
});

// GET SESSION INFO
router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('participants', 'username baristaId');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching session' });
  }
});

module.exports = router;
