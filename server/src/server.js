const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: ['https://smartjobzz.netlify.app', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/saved-jobs', require('./routes/savedJobRoutes'));

const PORT = process.env.PORT || 5000;

// Sync Database and Start Server
sequelize.sync({ alter: true }) // alter: true updates tables if models change
    .then(() => {
        console.log('Database synced');
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    })
    .catch(err => console.log('Error: ' + err));
