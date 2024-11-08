const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const auth = async ( req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if(!token){
            return res.status(401).json({message : 'Authentication required'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

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

const adminAuth = async (req, res, next) => {
    try {
      await auth(req, res, () => {
        if (!req.user.isAdmin) {
          return res.status(403).json({ error: 'Admin access required' });
        }
        next();   
      });
    } catch (error) {
      res.status(401).json({ error: 'Authentication failed' });
    }
  };

  module.exports = { auth, adminAuth };