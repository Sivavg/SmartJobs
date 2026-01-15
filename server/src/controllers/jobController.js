const { Job, User, Sequelize, Company } = require('../models');
const { Op } = Sequelize;

exports.createJob = async (req, res) => {
    try {
        const { title, description, requirements, location, salaryRange, jobType, experienceLevel, skills } = req.body;
        const job = await Job.create({
            title,
            description,
            requirements,
            location,
            salaryRange,
            jobType,
            experienceLevel,
            skills,
            recruiterId: req.user.id,
        });
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getJobs = async (req, res) => {
    try {
        const { title, location, jobType, experienceLevel, sort, page = 1, limit = 10 } = req.query;
        const where = {};

        if (title) {
            where.title = { [Op.like]: `%${title}%` };
        }
        if (location) {
            where.location = { [Op.like]: `%${location}%` };
        }
        if (jobType) {
            where.jobType = jobType;
        }
        if (experienceLevel) {
            where.experienceLevel = experienceLevel;
        }

        let order = [['createdAt', 'DESC']];
        if (sort === 'oldest') {
            order = [['createdAt', 'ASC']];
        }

        // Calculate pagination
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const offset = (pageNumber - 1) * limitNumber;

        const { count, rows: jobs } = await Job.findAndCountAll({
            where,
            order,
            limit: limitNumber,
            offset,
            include: [
                {
                    model: User,
                    as: 'recruiter',
                    attributes: ['name'],
                    include: [{
                        model: Company,
                        as: 'company',
                        attributes: ['name', 'logo', 'website', 'about']
                    }]
                },
            ],
        });

        // Return jobs with pagination metadata
        res.json({
            jobs,
            pagination: {
                total: count,
                currentPage: pageNumber,
                totalPages: Math.ceil(count / limitNumber),
                limit: limitNumber
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'recruiter',
                    attributes: ['name'],
                    include: [{
                        model: Company,
                        as: 'company',
                        attributes: ['name', 'logo', 'website', 'about']
                    }]
                },
            ],
        });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getRelatedJobs = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        const relatedJobs = await Job.findAll({
            where: {
                location: job.location,
                id: { [Op.ne]: job.id }
            },
            limit: 3,
            include: [
                {
                    model: User,
                    as: 'recruiter',
                    attributes: ['name'],
                    include: [{
                        model: Company,
                        as: 'company',
                        attributes: ['name', 'logo', 'website', 'about']
                    }]
                },
            ],
        });
        res.json(relatedJobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get jobs posted by current recruiter
exports.getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll({
            where: { recruiterId: req.user.id },
            include: [{
                model: User,
                as: 'recruiter',
                attributes: ['name'],
                include: [{
                    model: Company,
                    as: 'company',
                    attributes: ['name', 'logo', 'website', 'about']
                }]
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(jobs);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Close a job (change status to closed)
exports.closeJob = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if the recruiter owns this job
        if (job.recruiterId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to close this job' });
        }

        job.status = 'closed';
        await job.save();

        res.json({ message: 'Job closed successfully', job });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reopen a job (change status from closed to open)
exports.reopenJob = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if the recruiter owns this job
        if (job.recruiterId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to reopen this job' });
        }

        job.status = 'open';
        await job.save();

        res.json({ message: 'Job reopened successfully', job });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


// Delete a job
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if the recruiter owns this job
        if (job.recruiterId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this job' });
        }

        await job.destroy();

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

