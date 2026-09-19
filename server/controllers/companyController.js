const db = require("../config/db");

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
	getCompanies,
};