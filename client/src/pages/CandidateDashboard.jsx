import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const CandidateDashboard = () => {
    const navigate = useNavigate();
    const [loadingApplications, setLoadingApplications] = useState(true);
    const [applicationStats, setApplicationStats] = useState({
        total: 0,
        submitted: 0,
        reviewing: 0,
        accepted: 0,
        rejected: 0,
    });

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await api.get("/applications");
                const applications = response.data.applications || [];

                setApplicationStats({
                    total: applications.length,
                    submitted: applications.filter(
                        (application) => application.status === "SUBMITTED"
                    ).length,
                    reviewing: applications.filter(
                        (application) => application.status === "REVIEWING"
                    ).length,
                    accepted: applications.filter(
                        (application) => application.status === "ACCEPTED"
                    ).length,
                    rejected: applications.filter(
                        (application) => application.status === "REJECTED"
                    ).length,
                });
            } catch {
                setApplicationStats({
                    total: 0,
                    submitted: 0,
                    reviewing: 0,
                    accepted: 0,
                    rejected: 0,
                });
            } finally {
                setLoadingApplications(false);
            }
        };

        fetchApplications();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    let userName = "";

    try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (typeof user?.name === "string" && user.name.trim()) {
            userName = user.name.trim();
        }
    } catch {
        userName = "";
    }

    return (
        <main className="min-h-screen bg-gray-100 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <section className="mb-8 rounded-lg bg-white p-8 shadow-md">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold text-gray-800">
                                Candidate Dashboard
                            </h1>
                            <p className="text-gray-600">
                                {userName
                                    ? `Welcome, ${userName}!`
                                    : "Welcome to your Job Portal dashboard"}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </section>

                <section className="mb-8">
                    {loadingApplications ? (
                        <p className="rounded-lg bg-white p-6 text-gray-700 shadow-md">
                            Loading...
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                            {[
                                ["Total Applications", applicationStats.total],
                                ["Submitted", applicationStats.submitted],
                                ["Reviewing", applicationStats.reviewing],
                                ["Accepted", applicationStats.accepted],
                                ["Rejected", applicationStats.rejected],
                            ].map(([label, value]) => (
                                <article
                                    key={label}
                                    className="rounded-lg bg-white p-5 text-center shadow-md"
                                >
                                    <p className="text-sm font-medium text-gray-600">
                                        {label}
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-gray-800">
                                        {value}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <section className="grid gap-6 md:grid-cols-3">
                    <Link to="/jobs" className="block">
                        <article className="rounded-lg bg-white p-6 shadow-md">
                            <h2 className="mb-2 text-xl font-semibold text-gray-800">
                                Browse Jobs
                            </h2>
                            <p className="text-gray-600">
                                Explore available job opportunities.
                            </p>
                        </article>
                    </Link>

                    <Link to="/applications" className="block">
                        <article className="rounded-lg bg-white p-6 shadow-md">
                            <h2 className="mb-2 text-xl font-semibold text-gray-800">
                                My Applications
                            </h2>
                            <p className="text-gray-600">
                                View and manage your job applications.
                            </p>
                        </article>
                    </Link>

                    <Link to="/candidate/profile" className="block">
                        <article className="rounded-lg bg-white p-6 shadow-md">
                            <h2 className="mb-2 text-xl font-semibold text-gray-800">
                                My Profile
                            </h2>
                            <p className="text-gray-600">
                                Review and update your candidate profile.
                            </p>
                        </article>
                    </Link>
                </section>
            </div>
        </main>
    );
};

export default CandidateDashboard;