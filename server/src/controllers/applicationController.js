const { Application, Job, User } = require('../models');
const path = require('path');

exports.applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const candidateId = req.user.id;

        // Check if already applied
        const existingApplication = await Application.findOne({
            where: { jobId, candidateId },
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Resume is required' });
        }

        const resumeUrl = req.file.path.replace(/\\/g, "/"); // Normalize path

        const application = await Application.create({
            jobId,
            candidateId,
            resumeUrl,
        });

        res.json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getApplicationsForJob = async (req, res) => {
    // Recruiter viewing applications for their job
    try {
        const { jobId } = req.params;
        const job = await Job.findByPk(jobId);

        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.recruiterId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

        const applications = await Application.findAll({
            where: { jobId },
            include: [
                {
                    model: User,
                    as: 'candidate',
                    attributes: ['name', 'email']
                }
            ]
        });
        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.getMyApplications = async (req, res) => {
    try {
        const { Company } = require('../models');
        const applications = await Application.findAll({
            where: { candidateId: req.user.id },
            include: [
                {
                    model: Job,
                    as: 'job',
                    include: [
                        {
                            model: User,
                            as: 'recruiter',
                            attributes: ['name'],
                            include: [{
                                model: Company,
                                as: 'company',
                                attributes: ['name']
                            }]
                        }
                    ]
                }
            ]
        });
        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const application = await Application.findByPk(id, {
            include: [{ model: Job, as: 'job' }]
        });

        if (!application) return res.status(404).json({ message: 'Application not found' });
        if (application.job.recruiterId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

        application.status = status;
        await application.save();

        res.json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

// Check if candidate has applied to a specific job
exports.checkApplicationStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        const candidateId = req.user.id;

        const application = await Application.findOne({
            where: { jobId, candidateId }
        });

        if (application) {
            res.json({ hasApplied: true, status: application.status, applicationId: application.id });
        } else {
            res.json({ hasApplied: false });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
