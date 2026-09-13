const express = require('express');
const { createJob } = require('../controllers/jobController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createJob);

module.exports = router;
