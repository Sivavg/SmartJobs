const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authMiddleware, recruiterMiddleware } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            cb(new Error('Only .pdf, .doc and .docx format allowed!'));
        }
    }
});

router.post('/', authMiddleware, upload.single('resume'), applicationController.applyForJob);
router.get('/my', authMiddleware, applicationController.getMyApplications);
router.get('/check/:jobId', authMiddleware, applicationController.checkApplicationStatus);
router.get('/job/:jobId', authMiddleware, recruiterMiddleware, applicationController.getApplicationsForJob);
router.patch('/:id/status', authMiddleware, recruiterMiddleware, applicationController.updateApplicationStatus);

module.exports = router;
