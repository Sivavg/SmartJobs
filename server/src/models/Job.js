const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    requirements: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    salaryRange: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    jobType: {
        type: DataTypes.STRING, // Full-time, Part-time, etc.
        allowNull: false,
    },
    experienceLevel: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    skills: {
        type: DataTypes.STRING, // Comma separated or JSON
        allowNull: true,
    },
    recruiterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('open', 'closed'),
        defaultValue: 'open',
    },
});

module.exports = Job;
