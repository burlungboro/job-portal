const express = require('express');
const { createJob, getJobs, getJobById, updateJob, deleteJob } = require('../controllers/jobController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', authMiddleware, requireRole('RECRUITER'), createJob);
router.put('/:id', authMiddleware, requireRole('RECRUITER'), updateJob);
router.delete('/:id', authMiddleware, requireRole('RECRUITER'), deleteJob);

module.exports = router;
