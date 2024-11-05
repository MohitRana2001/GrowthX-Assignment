const express = require('express');
const { body , validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', 
    [
        body('username').trim().isLength({min: 3}),
        body('password').isLength({ min: 6}),
        body('role').isIn(['user', 'admin']),
    ],
    async ( req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
        }

        const { username , password, role} = req.body;
        const existingUser = await User.findOne({ username});

        if(existingUser) {
            return res.status(400).json({ message : 'Username already exists'});
        }

        const user = new User({ username , password, role});
        await user.save();

        const token = jwt.sign(
            { userId: user._id},
            process.env.JWT_SECRET || 'my-secret-key',
            { expiresIn: '24h'}
        );

        res.status(201).json({token, role : user.role});
    } catch (error) {
        res.status(500).json({message : 'Server error'});
    }

    }
);

router.post('/login', [
    body('username').trim().notEmpty(),
    body('password').notEmpty(),
],
    async ( req, res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({errors : errors.array()});
            }

            const { username , password } = req.body;
            const user = await User.findOne({ username });

            if(!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ message : 'Invalid Credentials'});
            }

            const token = jwt.sign(
                { userId: user._id},
                process.env.JWT_SCERET || 'my-sceret-key',
                { expiresIn: '24h'}
            );

            res.json({ token, role: user.role});
        } catch ( error ) {
            res.status(500).json({ message : 'Server error'});
        }
    }
);

module.exports = router;

