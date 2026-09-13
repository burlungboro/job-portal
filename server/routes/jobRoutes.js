const express = require('express');
const { createJob, getJobs } = require('../controllers/jobController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getJobs);
router.post('/', authMiddleware, createJob);

module.exports = router;
