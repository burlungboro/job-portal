const express = require("express");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const jobRoutes = require("./routes/jobRoutes");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/recruiters", recruiterRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Job Portal API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
