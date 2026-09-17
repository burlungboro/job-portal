import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function getStatusClasses(status) {
    const statusClasses = {
        SUBMITTED: "bg-blue-100 text-blue-800",
        REVIEWING: "bg-amber-100 text-amber-800",
        ACCEPTED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
    };

    return statusClasses[status] || "bg-gray-100 text-gray-800";
}

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await api.get("/applications");
                setApplications(response.data.applications || []);
            } catch {
                setError(
                    "Unable to load your applications. Please try again later."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) {
        return <p className="p-6 text-gray-700">Loading applications...</p>;
    }

    if (error) {
        return <p className="p-6 text-red-600">{error}</p>;
    }

    return (
        <main className="min-h-screen bg-gray-100 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                        My Applications
                    </h1>
                    <Link
                        to="/candidate"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {applications.length === 0 ? (
                    <p className="rounded-lg bg-white p-6 text-gray-700 shadow-md">
                        No applications found.
                    </p>
                ) : (
                    <div className="space-y-6">
                        {applications.map((application) => (
                            <article
                                key={`${application.job_id}-${application.applied_at}`}
                                className="rounded-lg bg-white p-6 shadow-md"
                            >
                                <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                                    {application.job_title}
                                </h2>
                                <div className="space-y-2 text-gray-700">
                                    <p>
                                        <strong>Company:</strong>{" "}
                                        {application.company_name}
                                    </p>
                                    <p>
                                        <strong>Location:</strong>{" "}
                                        {application.job_location}
                                    </p>
                                    <p>
                                        <strong>Employment type:</strong>{" "}
                                        {application.employment_type}
                                    </p>
                                    <p>
                                        <strong>Application status:</strong>{" "}
                                        <span
                                            className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                                                application.status
                                            )}`}
                                        >
                                            {application.status}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>Cover letter:</strong>{" "}
                                        {application.cover_letter ||
                                            "No cover letter provided."}
                                    </p>
                                    <p>
                                        <strong>Applied date:</strong>{" "}
                                        {new Date(
                                            application.applied_at
                                        ).toLocaleDateString()}
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

export default MyApplications;