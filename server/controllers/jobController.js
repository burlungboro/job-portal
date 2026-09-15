const db = require("../config/db");

const ALLOWED_EMPLOYMENT_TYPES = [
	"FULL_TIME",
	"PART_TIME",
	"INTERNSHIP",
	"CONTRACT",
];
const ALLOWED_STATUSES = ["DRAFT", "OPEN", "CLOSED"];

const createJob = async (req, res) => {
	const {
		company_id,
		title,
		description,
		location = null,
		employment_type = "FULL_TIME",
		salary_min = null,
		salary_max = null,
		experience_required = null,
		skills_required = null,
		application_deadline = null,
		status = "OPEN",
	} = req.body;

	if (!company_id || !title || !description) {
		return res.status(400).json({
			message: "company_id, title, and description are required",
		});
	}

	if (
		employment_type !== null &&
		!ALLOWED_EMPLOYMENT_TYPES.includes(employment_type)
	) {
		return res.status(400).json({
			message: "Invalid employment_type",
		});
	}

	if (status !== null && !ALLOWED_STATUSES.includes(status)) {
		return res.status(400).json({
			message: "Invalid status",
		});
	}

	const recruiter_id = req.user.id;

	try {
		const [result] = await db.execute(
			`INSERT INTO jobs
			 (recruiter_id, company_id, title, description, location,
			  employment_type, salary_min, salary_max, experience_required,
			  skills_required, application_deadline, status)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				recruiter_id,
				company_id,
				title,
				description,
				location,
				employment_type,
				salary_min,
				salary_max,
				experience_required,
				skills_required,
				application_deadline,
				status,
			]
		);

		return res.status(201).json({
			id: result.insertId,
			recruiter_id,
			company_id,
			title,
			description,
			location,
			employment_type,
			salary_min,
			salary_max,
			experience_required,
			skills_required,
			application_deadline,
			status,
		});
	} catch (error) {
		console.error("Create job error:", error);

		return res.status(500).json({
			message: "Server error while creating job",
		});
	}
};

const getJobs = async (req, res) => {
	try {
		const [jobs] = await db.execute(
			"SELECT * FROM jobs ORDER BY created_at DESC"
		);

		return res.status(200).json(jobs);
	} catch (error) {
		console.error("Get jobs error:", error);

		return res.status(500).json({
			message: "Server error while retrieving jobs",
		});
	}
};

const getRecruiterJobs = async (req, res) => {
	const recruiterId = req.user.id;

	try {
		const [jobs] = await db.execute(
			"SELECT * FROM jobs WHERE recruiter_id = ? ORDER BY created_at DESC",
			[recruiterId]
		);

		return res.status(200).json(jobs);
	} catch (error) {
		console.error("Get recruiter jobs error:", error);

		return res.status(500).json({
			message: "Server error while retrieving recruiter jobs",
		});
	}
};

const getJobById = async (req, res) => {
	try {
		const [jobs] = await db.execute("SELECT * FROM jobs WHERE id = ?", [
			req.params.id,
		]);

		if (jobs.length === 0) {
			return res.status(404).json({
				message: "Job not found",
			});
		}

		return res.status(200).json(jobs[0]);
	} catch (error) {
		console.error("Get job by ID error:", error);

		return res.status(500).json({
			message: "Server error while retrieving job",
		});
	}
};

const updateJob = async (req, res) => {
	const {
		company_id,
		title,
		description,
		location,
		employment_type,
		salary_min,
		salary_max,
		experience_required,
		skills_required,
		application_deadline,
		status,
	} = req.body;

	if (
		employment_type !== undefined &&
		!ALLOWED_EMPLOYMENT_TYPES.includes(employment_type)
	) {
		return res.status(400).json({
			message: "Invalid employment_type",
		});
	}

	if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
		return res.status(400).json({
			message: "Invalid status",
		});
	}

	const jobId = req.params.id;
	const recruiterId = req.user.id;

	try {
		const [existingJobs] = await db.execute(
			"SELECT * FROM jobs WHERE id = ? AND recruiter_id = ?",
			[jobId, recruiterId]
		);

		if (existingJobs.length === 0) {
			return res.status(404).json({
				message: "Job not found",
			});
		}

		const existingJob = existingJobs[0];
		const updatedJobData = {
			company_id: company_id ?? existingJob.company_id,
			title: title ?? existingJob.title,
			description: description ?? existingJob.description,
			location: location ?? existingJob.location,
			employment_type:
				employment_type ?? existingJob.employment_type,
			salary_min: salary_min ?? existingJob.salary_min,
			salary_max: salary_max ?? existingJob.salary_max,
			experience_required:
				experience_required ?? existingJob.experience_required,
			skills_required: skills_required ?? existingJob.skills_required,
			application_deadline:
				application_deadline ?? existingJob.application_deadline,
			status: status ?? existingJob.status,
		};

		await db.execute(
			`UPDATE jobs SET
				company_id = ?,
				title = ?,
				description = ?,
				location = ?,
				employment_type = ?,
				salary_min = ?,
				salary_max = ?,
				experience_required = ?,
				skills_required = ?,
				application_deadline = ?,
				status = ?
			 WHERE id = ? AND recruiter_id = ?`,
			[
				updatedJobData.company_id,
				updatedJobData.title,
				updatedJobData.description,
				updatedJobData.location,
				updatedJobData.employment_type,
				updatedJobData.salary_min,
				updatedJobData.salary_max,
				updatedJobData.experience_required,
				updatedJobData.skills_required,
				updatedJobData.application_deadline,
				updatedJobData.status,
				jobId,
				recruiterId,
			]
		);

		const [updatedJobs] = await db.execute("SELECT * FROM jobs WHERE id = ?", [
			jobId,
		]);

		return res.status(200).json({
			message: "Job updated successfully",
			job: updatedJobs[0],
		});
	} catch (error) {
		console.error("Update job error:", error);

		return res.status(500).json({
			message: "Server error while updating job",
		});
	}
};

const deleteJob = async (req, res) => {
	const jobId = req.params.id;
	const recruiterId = req.user.id;

	try {
		const [result] = await db.execute(
			"DELETE FROM jobs WHERE id = ? AND recruiter_id = ?",
			[jobId, recruiterId]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({
				message: "Job not found",
			});
		}

		return res.status(200).json({
			message: "Job deleted successfully",
		});
	} catch (error) {
		console.error("Delete job error:", error);

		return res.status(500).json({
			message: "Server error while deleting job",
		});
	}
};

module.exports = {
	createJob,
	getJobs,
	getRecruiterJobs,
	getJobById,
	updateJob,
	deleteJob,
};
