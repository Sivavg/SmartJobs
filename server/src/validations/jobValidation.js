const { check } = require('express-validator');

exports.createJobValidation = [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('requirements', 'Requirements are required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('jobType', 'Job Type is required').not().isEmpty(),
];
