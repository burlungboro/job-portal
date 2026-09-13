const express = require("express");
const {
	getRecruiterProfile,
	upsertRecruiterProfile,
} = require("../controllers/recruiterController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getRecruiterProfile);
router.put("/profile", authMiddleware, upsertRecruiterProfile);

module.exports = router;
