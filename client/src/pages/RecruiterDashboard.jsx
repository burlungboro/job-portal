import { Link, useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
    const navigate = useNavigate();

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