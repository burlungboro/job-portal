const express = require("express");

const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const {
    applyForJob,
    getMyApplications,
    getApplicationsForRecruiter,
    updateApplicationStatus,
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

router.put(
    "/:id/status",
    authMiddleware,
    requireRole("RECRUITER"),
    updateApplicationStatus
);

module.exports = router;