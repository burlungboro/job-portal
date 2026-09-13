const db = require("../config/db");

const getCandidateProfile = async (req, res) => {
	try {
		const [profiles] = await db.execute(
			"SELECT * FROM candidate_profiles WHERE user_id = ?",
			[req.user.id]
		);

		if (profiles.length === 0) {
			return res.status(404).json({
				message: "Candidate profile not found",
			});
		}

		return res.status(200).json(profiles[0]);
	} catch (error) {
		console.error("Get candidate profile error:", error);

		return res.status(500).json({
			message: "Server error while retrieving candidate profile",
		});
	}
};

const upsertCandidateProfile = async (req, res) => {
	try {
		const userId = req.user.id;
		const { phone, location, headline, bio, profile_picture, resume_url } =
			req.body;

		const [existingProfiles] = await db.execute(
			"SELECT * FROM candidate_profiles WHERE user_id = ?",
			[userId]
		);

		const profileValues = [
			phone,
			location,
			headline,
			bio,
			profile_picture,
			resume_url,
		];

		if (existingProfiles.length > 0) {
			await db.execute(
				`UPDATE candidate_profiles
				 SET phone = ?, location = ?, headline = ?, bio = ?,
						 profile_picture = ?, resume_url = ?
				 WHERE user_id = ?`,
				[...profileValues, userId]
			);

			return res.status(200).json({
				...existingProfiles[0],
				phone,
				location,
				headline,
				bio,
				profile_picture,
				resume_url,
			});
		}

		const [result] = await db.execute(
			`INSERT INTO candidate_profiles
			 (user_id, phone, location, headline, bio, profile_picture, resume_url)
			 VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[userId, ...profileValues]
		);

		return res.status(201).json({
			id: result.insertId,
			user_id: userId,
			phone,
			location,
			headline,
			bio,
			profile_picture,
			resume_url,
		});
	} catch (error) {
		console.error("Upsert candidate profile error:", error);

		return res.status(500).json({
			message: "Server error while saving candidate profile",
		});
	}
};

module.exports = {
	getCandidateProfile,
	upsertCandidateProfile,
};
