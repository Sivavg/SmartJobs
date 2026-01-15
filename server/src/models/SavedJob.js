const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SavedJob = sequelize.define('SavedJob', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
    },
    jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'job_id'
    },
    savedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'saved_at'
    }
}, {
    tableName: 'saved_jobs',
    timestamps: false
});

module.exports = SavedJob;
