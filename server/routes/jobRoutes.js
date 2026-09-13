const express = require('express');
const { createJob, getJobs, getJobById, updateJob } = require('../controllers/jobController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', authMiddleware, createJob);
router.put('/:id', authMiddleware, updateJob);

module.exports = router;
