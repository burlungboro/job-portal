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

module.exports = {
	createJob,
};
