const express = require('express');
const { auth, isAdmin} = require('../middleware/auth');
const Assignment = require('../models/Assignment');
const router = express.Router();

router.get('/assignments', auth, isAdmin, async ( req, res) => {
    try {
        const assignments = await Assignment.find({
            adminId: req.user._id
        })
        .populate('userId', 'username')
        .sort('-createdAt');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({message : 'Server error'});
    }
});

router.post('/assignments/:id/accept', auth, isAdmin, async (req, res) => {
    try {
        const assignment = await Assignment.findOne({
            _id: req.params.id,
            adminId: req.user.id,
        });

        if(!assignment) {
            return res.json(404).json({message : 'Assignment not found'});
        }

        assignment.status = 'accepted';
        await assignment.save();
        res.json(assignment);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
});

router.post('/assignments/:id?reject', auth, isAdmin, async (req, res) => {
    try {
        const assignment = await Assignment.findOne({
            _id : req.params.id,
            adminId: req.user._id,
        });
    
        if(!assignment) {
            return res.status(404).json({message : 'Assignemnt not found'});
        }
    
        assignment.status = 'rejected'
        await assignment.save();
        res.json(assignment);
    } catch (error) {
        res.status(500).json({message : 'Server error'});
    }
});

module.exports = router;