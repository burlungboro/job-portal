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
    const [filterStatus, setFilterStatus] = useState("ALL");
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

    const filteredApplications =
        filterStatus === "ALL"
            ? applications
            : applications.filter(
                  (application) => application.status === filterStatus
              );

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 p-6 text-slate-900 sm:p-10">
                <div className="mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                    Loading applications...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-slate-50 p-6 text-slate-900 sm:p-10">
                <div className="mx-auto max-w-6xl rounded-xl border border-rose-200 bg-white p-8 text-center text-sm text-rose-600 shadow-sm">
                    {error}
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
                <aside className="flex w-full flex-col border-b border-slate-200 bg-white px-5 py-5 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">J</div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">JobPortal</span>
                    </div>

                    <nav className="mt-8 flex gap-2 overflow-x-auto lg:flex-col" aria-label="Main navigation">
                        <Link to="/candidate" className="flex min-w-fit items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 13h6V4H4v9Zm0 7h6v-4H4v4Zm10 0h6v-9h-6v9Zm0-16v4h6V4h-6Z" /></svg>
                            Dashboard
                        </Link>
                        <Link to="/jobs" className="flex min-w-fit items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 7h16M6 7V5h12v2m-14 0v12h16V7M9 12h6" /></svg>
                            Browse Jobs
                        </Link>
                        <Link to="/applications" className="flex min-w-fit items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M7 3h10v18H7zM9 7h6m-6 4h6m-6 4h4" /></svg>
                            My Applications
                        </Link>
                        <Link to="/candidate/profile" className="flex min-w-fit items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="8" r="3" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>
                            Profile
                        </Link>
                    </nav>
                </aside>

                <div className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
                    <header className="border-b border-slate-200 pb-7">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">Applications</p>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">My Applications</h1>
                        <p className="mt-3 max-w-2xl text-base text-slate-500">Track your application progress and stay up to date on every opportunity.</p>
                    </header>

                    <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-labelledby="application-filter-heading">
                        <div className="mb-3 flex items-center justify-between gap-4">
                            <div>
                                <h2 id="application-filter-heading" className="font-bold text-slate-900">Filter applications</h2>
                                <p className="mt-1 text-sm text-slate-500">Review your progress by status.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2" role="group" aria-label="Application status filter">
                            {["ALL", "SUBMITTED", "REVIEWING", "ACCEPTED", "REJECTED"].map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setFilterStatus(status)}
                                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${filterStatus === status ? "bg-blue-600 text-white shadow-sm" : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}
                                >
                                    {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="mt-8" aria-labelledby="application-list-heading">
                        <div className="mb-4 flex items-end justify-between gap-4">
                            <div>
                                <h2 id="application-list-heading" className="text-lg font-bold text-slate-900">Your applications</h2>
                                <p className="mt-1 text-sm text-slate-500">{filteredApplications.length} application{filteredApplications.length === 1 ? "" : "s"} shown</p>
                            </div>
                        </div>

                        {applications.length === 0 ? (
                            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M7 3h10v18H7zM9 7h6m-6 4h6m-6 4h4" /></svg>
                                </div>
                                <h3 className="mt-4 font-bold text-slate-900">No applications yet</h3>
                                <p className="mt-2 text-sm text-slate-500">Your submitted applications will appear here.</p>
                            </div>
                        ) : filteredApplications.length === 0 ? (
                            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
                                </div>
                                <h3 className="mt-4 font-bold text-slate-900">No matching applications</h3>
                                <p className="mt-2 text-sm text-slate-500">No applications found for this status.</p>
                            </div>
                        ) : (
                            <div className="grid gap-5 xl:grid-cols-2">
                                {filteredApplications.map((application) => (
                                    <article key={`${application.job_id}-${application.applied_at}`} className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700">{application.job_title}</h3>
                                                <p className="mt-2 text-sm font-semibold text-blue-600">{application.company_name}</p>
                                            </div>
                                            <span className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${getStatusClasses(application.status)}`}>{application.status}</span>
                                        </div>

                                        <div className="mt-6 grid gap-4 border-y border-slate-100 py-5 text-sm text-slate-600 sm:grid-cols-2">
                                            <p><span className="font-semibold text-slate-800">Location</span><br />{application.job_location}</p>
                                            <p><span className="font-semibold text-slate-800">Employment type</span><br />{application.employment_type}</p>
                                            <p><span className="font-semibold text-slate-800">Applied date</span><br />{new Date(application.applied_at).toLocaleDateString()}</p>
                                            <p><span className="font-semibold text-slate-800">Cover letter</span><br />{application.cover_letter || "No cover letter provided."}</p>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between pt-5">
                                            <span className="text-xs font-medium text-slate-400">Application status: {application.status}</span>
                                            <Link to={`/jobs/${application.job_id}`} className="text-sm font-semibold text-blue-600 transition hover:text-blue-700">View Job <span aria-hidden="true">-&gt;</span></Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}

export default MyApplications;