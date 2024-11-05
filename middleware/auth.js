const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.auth = async ( req, res, next) => {
    try {
        const token = req.header('Authorisation')?.replace('Bearer', '');
        if(!token){
            return res.status(401).json({message : 'Authentication required'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my-secret-key');

        const user = User.findById(decoded.userId);

        if(!user) {
            return res.status(401).json({
                message : 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({message : 'Invalid token'});
    }
};

exports.isAdmin = async ( req, res, next) => {
    if(req.user.role !== 'admin') {
        return res.status(403).json({message : 'Admin access required'});
    }
    next();
};