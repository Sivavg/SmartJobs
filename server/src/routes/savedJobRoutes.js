const express = require('express');
const router = express.Router();
const savedJobController = require('../controllers/savedJobController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, savedJobController.saveJob);
router.delete('/:jobId', authMiddleware, savedJobController.unsaveJob);
router.get('/', authMiddleware, savedJobController.getSavedJobs);
router.get('/check/:jobId', authMiddleware, savedJobController.checkIfSaved);

module.exports = router;
