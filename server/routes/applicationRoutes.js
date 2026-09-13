const express = require("express");

const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const {
    applyForJob,
    getMyApplications,
    getApplicationsForRecruiter,
} = require("../controllers/applicationController");

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

router.get(
    "/recruiter",
    authMiddleware,
    requireRole("RECRUITER"),
    getApplicationsForRecruiter
);

module.exports = router;