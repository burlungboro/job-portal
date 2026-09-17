const express = require("express");
const {
	getCandidateProfile,
	upsertCandidateProfile,
	uploadResume,
	uploadProfilePicture,
} = require("../controllers/candidateController");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
	uploadResume: resumeUpload,
	uploadProfilePicture: profilePictureUpload,
} = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getCandidateProfile);
router.put("/profile", authMiddleware, upsertCandidateProfile);
router.post("/resume", authMiddleware, resumeUpload.single("resume"), uploadResume);
router.post(
	"/profile-picture",
	authMiddleware,
	profilePictureUpload.single("profile_picture"),
	uploadProfilePicture
);

module.exports = router;
