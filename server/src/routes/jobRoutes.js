const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authMiddleware, recruiterMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, recruiterMiddleware, jobController.createJob);
router.get('/my-jobs', authMiddleware, recruiterMiddleware, jobController.getMyJobs);
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);
router.get('/:id/related', jobController.getRelatedJobs);
router.patch('/:id/close', authMiddleware, recruiterMiddleware, jobController.closeJob);
router.patch('/:id/reopen', authMiddleware, recruiterMiddleware, jobController.reopenJob);
router.delete('/:id', authMiddleware, recruiterMiddleware, jobController.deleteJob);

module.exports = router;
