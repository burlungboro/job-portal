const db = require("../config/db");

const createCompany = async (req, res) => {
	if (!req.user || !req.user.id) {
		return res.status(401).json({
			message: "Authentication required",
		});
	}

	const { name, description = null, website = null, location = null } =
		req.body;

	if (typeof name !== "string" || name.trim() === "") {
		return res.status(400).json({
			message: "Company name is required",
		});
	}

	const companyName = name.trim();

	try {
		const [result] = await db.execute(
			`INSERT INTO companies (name, description, website, location)
			 VALUES (?, ?, ?, ?)`,
			[companyName, description, website, location]
		);

		return res.status(201).json({
			id: result.insertId,
			name: companyName,
			description,
			website,
			location,
			logo_url: null,
		});
	} catch (error) {
		console.error("Create company error:", error);

		return res.status(500).json({
			message: "Server error while creating company",
		});
	}
};

const getCompanies = async (req, res) => {
	try {
		const [companies] = await db.execute(
			`SELECT id, name, description, website, location, logo_url
			 FROM companies
			 ORDER BY name ASC`
		);

		return res.status(200).json(companies);
	} catch (error) {
		console.error("Get companies error:", error);

		return res.status(500).json({
			message: "Server error while retrieving companies",
		});
	}
};

module.exports = {
	createCompany,
	getCompanies,
};