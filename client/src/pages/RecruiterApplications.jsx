import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function RecruiterApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    const updateApplicationStatus = async (applicationId, newStatus) => {
        setStatusMessage("");

        try {
            await api.put(`/applications/${applicationId}/status`, {
                status: newStatus,
            });

            setApplications((currentApplications) =>
                currentApplications.map((application) =>
                    application.application_id === applicationId
                        ? { ...application, status: newStatus }
                        : application
                )
            );
            setStatusMessage("Status updated successfully.");
        } catch (requestError) {
            setStatusMessage(
                requestError.response?.data?.message ||
                    "Unable to update application status. Please try again."
            );
        }
    };

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await api.get("/applications/recruiter");
                setApplications(response.data.applications);
            } catch {
                setError(
                    "Unable to load recruiter applications. Please try again later."
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
                        Recruiter Applications
                    </h1>
                    <Link
                        to="/recruiter"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {statusMessage && (
                    <p className="mb-6 rounded-lg bg-white p-4 text-gray-700 shadow-md">
                        {statusMessage}
                    </p>
                )}

                {applications.length === 0 ? (
                    <p className="rounded-lg bg-white p-6 text-gray-700 shadow-md">
                        No applications found.
                    </p>
                ) : (
                    <div className="space-y-6">
                        {applications.map((application) => (
                            <article
                                key={application.application_id}
                                className="rounded-lg bg-white p-6 shadow-md"
                            >
                                <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                                    {application.candidate_name}
                                </h2>
                                <div className="space-y-2 text-gray-700">
                                    <p>
                                        <strong>Candidate email:</strong>{" "}
                                        {application.candidate_email}
                                    </p>
                                    <p>
                                        <strong>Job title:</strong>{" "}
                                        {application.job_title}
                                    </p>
                                    <p>
                                        <strong>Company:</strong>{" "}
                                        {application.company_name}
                                    </p>
                                    <p>
                                        <strong>Application status:</strong>{" "}
                                        <select
                                            value={application.status}
                                            onChange={(event) =>
                                                updateApplicationStatus(
                                                    application.application_id,
                                                    event.target.value
                                                )
                                            }
                                            className="rounded border border-gray-300 bg-white px-2 py-1"
                                        >
                                            <option value="SUBMITTED">
                                                SUBMITTED
                                            </option>
                                            <option value="REVIEWING">
                                                REVIEWING
                                            </option>
                                            <option value="REJECTED">
                                                REJECTED
                                            </option>
                                            <option value="ACCEPTED">
                                                ACCEPTED
                                            </option>
                                        </select>
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

export default RecruiterApplications;
