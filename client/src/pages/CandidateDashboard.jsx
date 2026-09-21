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
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
                <aside className="flex w-full flex-col border-b border-slate-200 bg-white px-5 py-5 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                            J
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            JobPortal
                        </span>
                    </div>

                    <nav className="mt-8 flex gap-2 overflow-x-auto lg:flex-col" aria-label="Main navigation">
                        <Link
                            to="/candidate"
                            className="flex min-w-fit items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                <path d="M4 13h6V4H4v9Zm0 7h6v-4H4v4Zm10 0h6v-9h-6v9Zm0-16v4h6V4h-6Z" />
                            </svg>
                            Dashboard
                        </Link>
                        <Link to="/jobs" className="flex min-w-fit items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                <path d="M4 7h16M6 7V5h12v2m-14 0v12h16V7M9 12h6" />
                            </svg>
                            Browse Jobs
                        </Link>
                        <Link to="/applications" className="flex min-w-fit items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                <path d="M7 3h10v18H7zM9 7h6m-6 4h6m-6 4h4" />
                            </svg>
                            My Applications
                        </Link>
                        <Link to="/candidate/profile" className="flex min-w-fit items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                <circle cx="12" cy="8" r="3" /><path d="M5 20a7 7 0 0 1 14 0" />
                            </svg>
                            Profile
                        </Link>
                    </nav>

                    <button type="button" onClick={handleLogout} className="mt-6 flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 lg:mt-auto">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <path d="M10 17l5-5-5-5m5 5H3m9-9h7v14h-7" />
                        </svg>
                        Logout
                    </button>
                </aside>

                <div className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-12 lg:py-9">
                    <header className="flex items-center justify-between gap-4 border-b border-slate-200 pb-6">
                        <div className="relative hidden max-w-md flex-1 sm:block">
                            <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                <circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" />
                            </svg>
                            <div className="rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-400">Search jobs, companies, or roles</div>
                        </div>
                        <div className="ml-auto flex items-center gap-4">
                            <button type="button" aria-label="Notifications" className="relative rounded-xl p-2 text-slate-500 hover:bg-white hover:text-blue-600">
                                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                    <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4" />
                                </svg>
                                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600" />
                            </button>
                            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="max-w-[160px] truncate text-sm font-semibold text-slate-800">{userName || "Candidate"}</p>
                                    <p className="text-xs text-slate-500">Candidate account</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    <section className="py-8">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">Your overview</p>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            {userName ? `Good to see you, ${userName}` : "Welcome to your dashboard"}
                        </h1>
                        <p className="mt-3 max-w-2xl text-base text-slate-500">Track your applications and discover your next career opportunity.</p>
                    </section>

                    <section aria-labelledby="application-summary">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 id="application-summary" className="text-lg font-bold text-slate-900">Application summary</h2>
                            <Link to="/applications" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View all</Link>
                        </div>
                        {loadingApplications ? (
                            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">Loading applications...</div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                                {[
                                    ["Total Applications", applicationStats.total, "text-blue-600", "bg-blue-50"],
                                    ["Submitted", applicationStats.submitted, "text-sky-600", "bg-sky-50"],
                                    ["Reviewing", applicationStats.reviewing, "text-amber-600", "bg-amber-50"],
                                    ["Accepted", applicationStats.accepted, "text-emerald-600", "bg-emerald-50"],
                                    ["Rejected", applicationStats.rejected, "text-rose-600", "bg-rose-50"],
                                ].map(([label, value, textColor, iconBackground]) => (
                                    <article key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-sm font-medium leading-5 text-slate-500">{label}</p>
                                            <span className={`h-2.5 w-2.5 rounded-full ${iconBackground}`} aria-hidden="true" />
                                        </div>
                                        <p className={`mt-5 text-3xl font-bold ${textColor}`}>{value}</p>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="mt-8" aria-labelledby="quick-actions">
                        <h2 id="quick-actions" className="mb-4 text-lg font-bold text-slate-900">Continue your search</h2>
                        <div className="grid gap-4 md:grid-cols-3">
                            <Link to="/jobs" className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 7h16M6 7V5h12v2m-14 0v12h16V7M9 12h6" /></svg>
                                </div>
                                <h3 className="font-bold text-slate-900">Browse Jobs</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-500">Explore available job opportunities.</p>
                                <span className="mt-5 inline-block text-sm font-semibold text-blue-600 group-hover:text-blue-700">Find opportunities</span>
                            </Link>
                            <Link to="/applications" className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M7 3h10v18H7zM9 7h6m-6 4h6m-6 4h4" /></svg>
                                </div>
                                <h3 className="font-bold text-slate-900">My Applications</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-500">View and manage your job applications.</p>
                                <span className="mt-5 inline-block text-sm font-semibold text-blue-600 group-hover:text-blue-700">Review activity</span>
                            </Link>
                            <Link to="/candidate/profile" className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="8" r="3" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>
                                </div>
                                <h3 className="font-bold text-slate-900">My Profile</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-500">Review and update your candidate profile.</p>
                                <span className="mt-5 inline-block text-sm font-semibold text-blue-600 group-hover:text-blue-700">Edit profile</span>
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default CandidateDashboard;