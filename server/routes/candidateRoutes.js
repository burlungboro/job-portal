const express = require("express");
const {
	getCandidateProfile,
	upsertCandidateProfile,
	uploadResume,
} = require("../controllers/candidateController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { uploadResume: resumeUpload } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getCandidateProfile);
router.put("/profile", authMiddleware, upsertCandidateProfile);
router.post("/resume", authMiddleware, resumeUpload.single("resume"), uploadResume);

module.exports = router;
