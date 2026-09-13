const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const { applyForJob } = require("../controllers/applicationController");

const router = express.Router();

router.post(
	"/",
	authMiddleware,
	requireRole("CANDIDATE"),
	applyForJob
);

module.exports = router;
