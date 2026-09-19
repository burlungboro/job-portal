const express = require("express");
const { createCompany, getCompanies } = require("../controllers/companyController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getCompanies);
router.post("/", authMiddleware, requireRole("RECRUITER"), createCompany);

module.exports = router;
