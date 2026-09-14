import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function JobDetails() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await api.get(`/jobs/${id}`);
                setJob(response.data);
            } catch (requestError) {
                if (requestError.response?.status === 404) {
                    setNotFound(true);
                } else {
                    setError("Unable to load this job. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    if (loading) {
        return <p className="p-6 text-gray-700">Loading job...</p>;
    }

    if (notFound) {
        return <p className="p-6 text-gray-700">Job not found.</p>;
    }

    if (error) {
        return <p className="p-6 text-red-600">{error}</p>;
    }

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <article className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow">
                <h1 className="mb-6 text-3xl font-bold text-gray-900">
                    {job.title}
                </h1>

                <div className="space-y-3 text-gray-700">
                    <p>
                        <strong>Description:</strong> {job.description}
                    </p>
                    <p>
                        <strong>Location:</strong> {job.location}
                    </p>
                    <p>
                        <strong>Employment type:</strong> {job.employment_type}
                    </p>
                    <p>
                        <strong>Experience required:</strong> {job.experience_required}
                    </p>
                    <p>
                        <strong>Salary minimum:</strong> {job.salary_min}
                    </p>
                    <p>
                        <strong>Salary maximum:</strong> {job.salary_max}
                    </p>
                    <p>
                        <strong>Required skills:</strong> {job.skills_required}
                    </p>
                    <p>
                        <strong>Application deadline:</strong> {job.application_deadline}
                    </p>
                    <p>
                        <strong>Company ID:</strong> {job.company_id}
                    </p>
                    <p>
                        <strong>Job status:</strong> {job.status}
                    </p>
                </div>
            </article>
        </main>
    );
}

export default JobDetails;
