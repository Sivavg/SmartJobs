const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Job = require('./Job');
const Application = require('./Application');
const SavedJob = require('./SavedJob');
const Company = require('./Company');
const PasswordReset = require('./PasswordReset');

// Associations
// Company-User relationship
Company.hasMany(User, { foreignKey: 'companyId', as: 'recruiters' });
User.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

User.hasMany(Job, { foreignKey: 'recruiterId', as: 'postedJobs' });
Job.belongsTo(User, { foreignKey: 'recruiterId', as: 'recruiter' });

User.hasMany(Application, { foreignKey: 'candidateId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'candidateId', as: 'candidate' });

Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

// SavedJob associations
User.hasMany(SavedJob, { foreignKey: 'userId', as: 'savedJobs' });
SavedJob.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Job.hasMany(SavedJob, { foreignKey: 'jobId', as: 'saves' });
SavedJob.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

module.exports = {
    Sequelize,
    sequelize,
    User,
    Job,
    Application,
    SavedJob,
    Company,
    PasswordReset,
};
