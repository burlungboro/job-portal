import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const RecruiterDashboard = () => {
    const navigate = useNavigate();
    const [statistics, setStatistics] = useState({
        totalJobs: 0,
        openJobs: 0,
        totalApplications: 0,
    });
    const [statisticsLoading, setStatisticsLoading] = useState(true);

    useEffect(() => {
        const fetchStatistics = async () => {
            const results = await Promise.allSettled([
                api.get("/jobs/recruiter"),
                api.get("/applications/recruiter"),
            ]);
            const jobsResult = results[0];
            const applicationsResult = results[1];

            const jobs =
                jobsResult.status === "fulfilled" && Array.isArray(jobsResult.value.data)
                    ? jobsResult.value.data
                    : [];
            const applications =
                applicationsResult.status === "fulfilled" &&
                Array.isArray(applicationsResult.value.data?.applications)
                    ? applicationsResult.value.data.applications
                    : [];

            setStatistics({
                totalJobs: jobs.length,
                openJobs: jobs.filter((job) => job.status === "OPEN").length,
                totalApplications: applications.length,
            });
            setStatisticsLoading(false);
        };

        fetchStatistics();
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
                                Recruiter Dashboard
                            </h1>
                            {userName && (
                                <p className="text-gray-600">Welcome, {userName}!</p>
                            )}
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

                <section className="mb-8 grid gap-6 md:grid-cols-3">
                    {statisticsLoading ? (
                        <p className="text-gray-700">Loading...</p>
                    ) : (
                        [
                            ["Total Jobs", statistics.totalJobs],
                            ["Open Jobs", statistics.openJobs],
                            ["Total Applications", statistics.totalApplications],
                        ].map(([label, value]) => (
                            <article key={label} className="rounded-lg bg-white p-6 shadow-md">
                                <h2 className="mb-2 text-lg font-semibold text-gray-700">
                                    {label}
                                </h2>
                                <p className="text-3xl font-bold text-gray-900">{value}</p>
                            </article>
                        ))
                    )}
                </section>

                <section className="grid gap-6 md:grid-cols-3">
                    <Link to="/recruiter/jobs/create" className="block">
                        <article className="rounded-lg bg-white p-6 shadow-md">
                            <h2 className="mb-2 text-xl font-semibold text-gray-800">
                                Post a Job
                            </h2>
                            <p className="text-gray-600">
                                Create and publish a new job opportunity.
                            </p>
                        </article>
                    </Link>

                    <Link to="/recruiter/jobs" className="block">
                        <article className="rounded-lg bg-white p-6 shadow-md">
                            <h2 className="mb-2 text-xl font-semibold text-gray-800">
                                Manage Jobs
                            </h2>
                            <p className="text-gray-600">
                                View and manage jobs posted by you.
                            </p>
                        </article>
                    </Link>

                    <Link to="/recruiter/applications" className="block">
                        <article className="rounded-lg bg-white p-6 shadow-md">
                            <h2 className="mb-2 text-xl font-semibold text-gray-800">
                                View Applications
                            </h2>
                            <p className="text-gray-600">
                                Review applications submitted for your jobs.
                            </p>
                        </article>
                    </Link>

                    <Link to="/recruiter/profile" className="block">
                        <article className="rounded-lg bg-white p-6 shadow-md">
                            <h2 className="mb-2 text-xl font-semibold text-gray-800">
                                My Profile
                            </h2>
                            <p className="text-gray-600">
                                View and update your recruiter profile.
                            </p>
                        </article>
                    </Link>
                </section>
            </div>
        </main>
    );
};

export default RecruiterDashboard;