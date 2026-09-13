const db = require("../config/db");

const applyForJob = async (req, res) => {
	const { job_id, cover_letter = null } = req.body;
	const candidate_id = req.user.id;

	if (!job_id) {
		return res.status(400).json({
			message: "job_id is required",
		});
	}

	try {
		const [jobs] = await db.execute(
			"SELECT status FROM jobs WHERE id = ?",
			[job_id]
		);

		if (jobs.length === 0) {
			return res.status(404).json({
				message: "Job not found",
			});
		}

		if (jobs[0].status !== "OPEN") {
			return res.status(400).json({
				message: "This job is not open for applications",
			});
		}

		const [existingApplications] = await db.execute(
			"SELECT id FROM job_applications WHERE candidate_id = ? AND job_id = ?",
			[candidate_id, job_id]
		);

		if (existingApplications.length > 0) {
			return res.status(409).json({
				message: "You have already applied for this job",
			});
		}

		const [result] = await db.execute(
			`INSERT INTO job_applications (candidate_id, job_id, cover_letter)
			 VALUES (?, ?, ?)`,
			[candidate_id, job_id, cover_letter]
		);

		return res.status(201).json({
			message: "Application submitted successfully",
			application: {
				id: result.insertId,
				candidate_id,
				job_id,
				status: "SUBMITTED",
				cover_letter,
			},
		});
	} catch (error) {
		console.error("Apply for job error:", error);

		return res.status(500).json({
			message: "Server error while submitting application",
		});
	}
};

const getMyApplications = async (req, res) => {
	const candidate_id = req.user.id;

	try {
		const [applications] = await db.execute(
			`SELECT
				ja.job_id,
				j.title AS job_title,
				j.location AS job_location,
				j.employment_type,
				j.company_id,
				ja.status,
				ja.cover_letter,
				ja.applied_at,
				ja.updated_at,
				c.name AS company_name
			 FROM job_applications ja
			 JOIN jobs j ON ja.job_id = j.id
			 JOIN companies c ON j.company_id = c.id
			 WHERE ja.candidate_id = ?
			 ORDER BY ja.applied_at DESC`,
			[candidate_id]
		);

		return res.status(200).json({
			applications,
		});
	} catch (error) {
		console.error("Get my applications error:", error);

		return res.status(500).json({
			message: "Server error while retrieving applications",
		});
	}
};

module.exports = {
	applyForJob,
	getMyApplications,
};
