import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function ManageJobs() {
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get("/jobs/recruiter");
                setJobs(response.data);
            } catch {
                setError("Unable to load jobs. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await api.get("/companies");
                setCompanies(Array.isArray(response.data) ? response.data : []);
            } catch {
                setCompanies([]);
            }
        };

        fetchCompanies();
    }, []);

    const handleDelete = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job?")) {
            return;
        }

        try {
            await api.delete(`/jobs/${jobId}`);
            setJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobId));
            setMessage("Job deleted successfully.");
        } catch (deleteError) {
            setMessage(
                deleteError.response?.data?.message ||
                    "Unable to delete job. Please try again later."
            );
        }
    };

    if (loading) {
        return <p className="p-6 text-gray-700">Loading jobs...</p>;
    }

    if (error) {
        return <p className="p-6 text-red-600">{error}</p>;
    }

    return (
        <main className="min-h-screen bg-gray-100 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">Manage Jobs</h1>
                    <Link
                        to="/recruiter"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {message && <p className="mb-6 text-gray-700">{message}</p>}

                {jobs.length === 0 ? (
                    <p className="text-gray-700">No jobs found.</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {jobs.map((job) => (
                            <article key={job.id} className="rounded-lg bg-white p-6 shadow-md">
                                <div className="mb-4 flex items-start justify-between gap-4">
                                    <h2 className="text-2xl font-semibold text-gray-900">
                                        {job.title}
                                    </h2>
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                                        {job.status || "Not specified"}
                                    </span>
                                </div>

                                <div className="space-y-2 text-gray-700">
                                    <p>
                                        <strong>Location:</strong> {job.location || "Not specified"}
                                    </p>
                                    <p>
                                        <strong>Company:</strong>{" "}
                                        {companies.find((company) => company.id === job.company_id)?.name ||
                                            "Unknown company"}
                                    </p>
                                    <p>
                                        <strong>Employment type:</strong>{" "}
                                        {job.employment_type || "Not specified"}
                                    </p>
                                    <p>
                                        <strong>Salary range:</strong>{" "}
                                        {job.salary_min || job.salary_max
                                            ? `${job.salary_min || "Not specified"} - ${job.salary_max || "Not specified"}`
                                            : "Not specified"}
                                    </p>
                                    <p>
                                        <strong>Experience required:</strong>{" "}
                                        {job.experience_required || "Not specified"}
                                    </p>
                                    <p>
                                        <strong>Required skills:</strong>{" "}
                                        {job.skills_required || "Not specified"}
                                    </p>
                                    <p>
                                        <strong>Application deadline:</strong>{" "}
                                        {job.application_deadline || "Not specified"}
                                    </p>
                                    <p>
                                        <strong>Job status:</strong> {job.status || "Not specified"}
                                    </p>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <Link
                                        to={`/recruiter/jobs/${job.id}/edit`}
                                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(job.id)}
                                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default ManageJobs;
