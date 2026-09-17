const express = require("express");

const {
    getRecruiterProfile,
    upsertRecruiterProfile,
} = require("../controllers/recruiterController");

const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/profile",
    authMiddleware,
    requireRole("RECRUITER"),
    getRecruiterProfile
);

router.put(
    "/profile",
    authMiddleware,
    requireRole("RECRUITER"),
    upsertRecruiterProfile
);

module.exports = router;