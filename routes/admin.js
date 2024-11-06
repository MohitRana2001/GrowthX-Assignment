const express = require('express');
const { adminAuth } = require('../middleware/auth');
const Assignment = require('../models/Assignment');
const router = express.Router();

router.get('/assignments', adminAuth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ admin: req.user._id })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

router.post('/assignments/:id/accept', adminAuth, async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      _id: req.params.id,
      admin: req.user._id
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    assignment.status = 'accepted';
    await assignment.save();
    res.json({ message: 'Assignment accepted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept assignment' });
  }
});

router.post('/assignments/:id/reject', adminAuth, async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      _id: req.params.id,
      admin: req.user._id
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    assignment.status = 'rejected';
    await assignment.save();
    res.json({ message: 'Assignment rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject assignment' });
  }
});

module.exports = router;