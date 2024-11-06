const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const assignmentRoutes = require('./routes/assignments');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT ||8000;

// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://ranamohit2051:user123@100xdevs.q5dmy0i.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api', authRoutes);
app.use('/api', assignmentRoutes);
app.use('/api', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});