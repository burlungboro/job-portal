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

const getApplicationsForRecruiter = async (req, res) => {
	const recruiter_id = req.user.id;

	try {
		const [applications] = await db.execute(
			`SELECT
				ja.id AS application_id,
				ja.candidate_id,
				u.name AS candidate_name,
				u.email AS candidate_email,
				ja.job_id,
				j.title AS job_title,
				c.id AS company_id,
				c.name AS company_name,
				ja.status,
				ja.cover_letter,
				ja.resume_url,
				ja.applied_at,
				ja.updated_at
			 FROM job_applications ja
			 JOIN jobs j ON ja.job_id = j.id
			 JOIN companies c ON j.company_id = c.id
			 JOIN users u ON ja.candidate_id = u.id
			 WHERE j.recruiter_id = ?
			 ORDER BY ja.applied_at DESC`,
			[recruiter_id]
		);

		return res.status(200).json({
			applications,
		});
	} catch (error) {
		console.error("Get recruiter applications error:", error);

		return res.status(500).json({
			message: "Server error while retrieving recruiter applications",
		});
	}
};


const updateApplicationStatus = async (req, res) => {
	const applicationId = req.params.id;
	const recruiterId = req.user.id;
	const { status } = req.body;

	const allowedStatuses = [
		"SUBMITTED",
		"REVIEWING",
		"REJECTED",
		"ACCEPTED",
	];

	if (!status || !allowedStatuses.includes(status)) {
		return res.status(400).json({
			message: "Invalid application status",
		});
	}

	try {
		const [applications] = await db.execute(
			`SELECT ja.id
			 FROM job_applications ja
			 JOIN jobs j ON ja.job_id = j.id
			 WHERE ja.id = ? AND j.recruiter_id = ?`,
			[applicationId, recruiterId]
		);

		if (applications.length === 0) {
			return res.status(404).json({
				message: "Application not found",
			});
		}

		await db.execute(
			`UPDATE job_applications
			 SET status = ?
			 WHERE id = ?`,
			[status, applicationId]
		);

		return res.status(200).json({
			message: "Application status updated successfully",
			application: {
				id: Number(applicationId),
				status,
			},
		});
	} catch (error) {
		console.error("Update application status error:", error);

		return res.status(500).json({
			message: "Server error while updating application status",
		});
	}
};

module.exports = {
	applyForJob,
	getMyApplications,
	getApplicationsForRecruiter,
	updateApplicationStatus,
};