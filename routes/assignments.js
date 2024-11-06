const express = require('express');
const { auth } = require('../middleware/auth');
const Assignment = require('../models/Assignment');
const User = require('../models/User');
const { assignmentSchema } = require('../validation/schemas');
const router = express.Router();

router.post('/upload', auth, async (req, res) => {
  try {
    const { success } = assignmentSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const { task, admin } = req.body;
    const adminUser = await User.findById(admin);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(400).json({ error: 'Invalid admin' });
    }
    const assignment = new Assignment({
      userId: req.user._id,
      task,
      admin: adminUser._id
    });

    await assignment.save();
    res.status(201).json({ message: 'Assignment uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.get('/admins', auth, async (req, res) => {
  try {
    const admins = await User.find({ isAdmin: true }, { username: 1 });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

module.exports = router;