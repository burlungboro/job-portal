const express = require('express');
const { createJob, getJobs, getJobById } = require('../controllers/jobController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', authMiddleware, createJob);

module.exports = router;
