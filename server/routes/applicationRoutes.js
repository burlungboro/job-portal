const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const { applyForJob, getMyApplications } = require("../controllers/applicationController");

const router = express.Router();

router.get(
	"/",
	authMiddleware,
	requireRole("CANDIDATE"),
	getMyApplications
);

router.post(
	"/",
	authMiddleware,
	requireRole("CANDIDATE"),
	applyForJob
);

module.exports = router;
