const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, (req, res) => {
	res.status(200).json({
		message: "Authenticated user",
		user: req.user,
	});
});

module.exports = router;