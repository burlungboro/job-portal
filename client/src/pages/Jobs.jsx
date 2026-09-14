import { useEffect, useState } from "react";
import api from "../api/axios";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get("/jobs");
                setJobs(response.data);
            } catch (requestError) {
                setError("Unable to load jobs. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return <p className="p-6 text-gray-700">Loading jobs...</p>;
    }

    if (error) {
        return <p className="p-6 text-red-600">{error}</p>;
    }

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-6 text-3xl font-bold text-gray-900">
                    Available Jobs
                </h1>

                {jobs.length === 0 ? (
                    <p className="text-gray-700">No jobs available.</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {jobs.map((job) => (
                            <article
                                key={job.id}
                                className="rounded-lg bg-white p-6 shadow"
                            >
                                <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                                    {job.title}
                                </h2>
                                <div className="space-y-2 text-gray-700">
                                    <p>
                                        <strong>Location:</strong> {job.location}
                                    </p>
                                    <p>
                                        <strong>Employment type:</strong>{" "}
                                        {job.employment_type}
                                    </p>
                                    <p>
                                        <strong>Experience required:</strong>{" "}
                                        {job.experience_required}
                                    </p>
                                    <p>
                                        <strong>Description:</strong> {job.description}
                                    </p>
                                    <p>
                                        <strong>Company ID:</strong> {job.company_id}
                                    </p>
                                    <p>
                                        <strong>Application deadline:</strong>{" "}
                                        {job.application_deadline}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default Jobs;
