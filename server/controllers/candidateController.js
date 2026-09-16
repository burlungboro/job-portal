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
		const normalizedPhone = phone ?? null;
		const normalizedLocation = location ?? null;
		const normalizedHeadline = headline ?? null;
		const normalizedBio = bio ?? null;
		const normalizedProfilePicture = profile_picture ?? null;
		const normalizedResumeUrl = resume_url ?? null;

		const [existingProfiles] = await db.execute(
			"SELECT * FROM candidate_profiles WHERE user_id = ?",
			[userId]
		);

		const profileValues = [
			normalizedPhone,
			normalizedLocation,
			normalizedHeadline,
			normalizedBio,
			normalizedProfilePicture,
			normalizedResumeUrl,
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
				phone: normalizedPhone,
				location: normalizedLocation,
				headline: normalizedHeadline,
				bio: normalizedBio,
				profile_picture: normalizedProfilePicture,
				resume_url: normalizedResumeUrl,
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
			phone: normalizedPhone,
			location: normalizedLocation,
			headline: normalizedHeadline,
			bio: normalizedBio,
			profile_picture: normalizedProfilePicture,
			resume_url: normalizedResumeUrl,
		});
	} catch (error) {
		console.error("Upsert candidate profile error:", error);

		return res.status(500).json({
			message: "Server error while saving candidate profile",
		});
	}
};

const uploadResume = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				message: "Resume file is required",
			});
		}

		const userId = req.user.id;
		const resumeUrl = `/uploads/resumes/${req.file.filename}`;
		const [existingProfiles] = await db.execute(
			"SELECT * FROM candidate_profiles WHERE user_id = ?",
			[userId]
		);

		if (existingProfiles.length > 0) {
			await db.execute(
				"UPDATE candidate_profiles SET resume_url = ? WHERE user_id = ?",
				[resumeUrl, userId]
			);

			return res.status(200).json({
				message: "Resume uploaded successfully",
				resume_url: resumeUrl,
			});
		}

		await db.execute(
			`INSERT INTO candidate_profiles
			 (user_id, phone, location, headline, bio, profile_picture, resume_url)
			 VALUES (?, NULL, NULL, NULL, NULL, NULL, ?)`,
			[userId, resumeUrl]
		);

		return res.status(201).json({
			message: "Resume uploaded successfully",
			resume_url: resumeUrl,
		});
	} catch (error) {
		console.error("Upload resume error:", error);

		return res.status(500).json({
			message: "Server error while uploading resume",
		});
	}
};

module.exports = {
	getCandidateProfile,
	upsertCandidateProfile,
	uploadResume,
};
