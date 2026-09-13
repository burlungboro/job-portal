const express = require("express");
const {
	getCandidateProfile,
	upsertCandidateProfile,
} = require("../controllers/candidateController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getCandidateProfile);
router.put("/profile", authMiddleware, upsertCandidateProfile);

module.exports = router;
