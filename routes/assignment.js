const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const Assignment = require('../models/Assignment');
const User = require('../models/User');
const router = express.Router();

router.post('/', auth, 
    [
        body('task').trim().notEmpty(),
        body('adminId').notEmpty(),
    ],
    async ( req, res ) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors: errors.array()});
            }

            const { task, adminId } = req.body;
            const admin = await User.findById(adminId);

            if(!admin || admin.role !== 'admin') {
                return res.status(400).json({message : 'Invalid admin ID'});
            }

            const assignment = new Assignment({
                userId : req.user._id,
                adminId,
                task,
            });

            await assignment.save();
            res.status(201).json(assignment);
        } catch (error) {
            res.status(500).json({message : 'Server error'});
        }
    }
);

router.get('/admins', auth, async ( req, res) => {
    try {
        const admins = await User.find({role : 'admin'}, 'username _id');
        res.json(admins);
    } catch (error) {
        res.status(500).json({message : 'Server error'});
    }
});

module.exports = router;