const db = require("../config/db");

const getRecruiterProfile = async (req, res) => {
	try {
		const [profiles] = await db.execute(
			"SELECT * FROM recruiter_profiles WHERE user_id = ?",
			[req.user.id]
		);

		if (profiles.length === 0) {
			return res.status(404).json({
				message: "Recruiter profile not found",
			});
		}

		return res.status(200).json(profiles[0]);
	} catch (error) {
		console.error("Get recruiter profile error:", error);

		return res.status(500).json({
			message: "Server error while retrieving recruiter profile",
		});
	}
};

const upsertRecruiterProfile = async (req, res) => {
	try {
		const userId = req.user.id;
		const { company_id, phone, job_title } = req.body;
		const normalizedCompanyId = company_id ?? null;
		const normalizedPhone = phone ?? null;
		const normalizedJobTitle = job_title ?? null;

		const [existingProfiles] = await db.execute(
			"SELECT * FROM recruiter_profiles WHERE user_id = ?",
			[userId]
		);

		if (existingProfiles.length > 0) {
			await db.execute(
				`UPDATE recruiter_profiles
				 SET company_id = ?, phone = ?, job_title = ?
				 WHERE user_id = ?`,
				[normalizedCompanyId, normalizedPhone, normalizedJobTitle, userId]
			);

			return res.status(200).json({
				...existingProfiles[0],
				company_id: normalizedCompanyId,
				phone: normalizedPhone,
				job_title: normalizedJobTitle,
			});
		}

		const [result] = await db.execute(
			`INSERT INTO recruiter_profiles
			 (user_id, company_id, phone, job_title)
			 VALUES (?, ?, ?, ?)`,
			[userId, normalizedCompanyId, normalizedPhone, normalizedJobTitle]
		);

		return res.status(201).json({
			id: result.insertId,
			user_id: userId,
			company_id: normalizedCompanyId,
			phone: normalizedPhone,
			job_title: normalizedJobTitle,
		});
	} catch (error) {
		console.error("Upsert recruiter profile error:", error);

		return res.status(500).json({
			message: "Server error while saving recruiter profile",
		});
	}
};

module.exports = {
	getRecruiterProfile,
	upsertRecruiterProfile,
};
