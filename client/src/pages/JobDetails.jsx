import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

function JobDetails() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notFound, setNotFound] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [applicationMessage, setApplicationMessage] = useState("");
    const [hasApplied, setHasApplied] = useState(false);

    const handleApply = async () => {
        try {
            await api.post("/applications", {
                job_id: id,
                cover_letter: coverLetter,
            });
            setHasApplied(true);
            setApplicationMessage("Application submitted successfully!");
        } catch (requestError) {
            setApplicationMessage(
                requestError.response?.data?.message ||
                    "Unable to submit your application. Please try again later."
            );
        }
    };

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
        return (
            <main className="min-h-screen bg-slate-50 p-6 text-slate-900 sm:p-10">
                <div className="mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                    Loading job...
                </div>
            </main>
        );
    }

    if (notFound) {
        return (
            <main className="min-h-screen bg-slate-50 p-6 text-slate-900 sm:p-10">
                <div className="mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                    Job not found.
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
                        <Link to="/jobs" className="flex min-w-fit items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 7h16M6 7V5h12v2m-14 0v12h16V7M9 12h6" /></svg>
                            Browse Jobs
                        </Link>
                        <Link to="/applications" className="flex min-w-fit items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
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
                    <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700">
                        <span aria-hidden="true">&lt;-</span> Back to Jobs
                    </Link>

                    <header className="mt-6 border-b border-slate-200 pb-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">Job opportunity</p>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{job.title}</h1>
                                <p className="mt-3 text-base font-semibold text-blue-600">{job.company_name || "Company not specified"}</p>
                            </div>
                            <span className="w-fit rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">{job.employment_type}</span>
                        </div>

                        <div className="mt-6 grid gap-4 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                            <p><span className="font-semibold text-slate-800">Location</span><br />{job.location || "Not specified"}</p>
                            <p><span className="font-semibold text-slate-800">Salary</span><br />
                                {job.salary_min != null && job.salary_max != null
                                    ? `₹${Number(job.salary_min).toLocaleString("en-IN")} – ₹${Number(job.salary_max).toLocaleString("en-IN")}`
                                    : job.salary_min != null
                                      ? `₹${Number(job.salary_min).toLocaleString("en-IN")}+`
                                      : job.salary_max != null
                                        ? `Up to ₹${Number(job.salary_max).toLocaleString("en-IN")}`
                                        : "Not specified"}
                            </p>
                            <p><span className="font-semibold text-slate-800">Experience</span><br />{job.experience_required || "Not specified"}</p>
                            <p><span className="font-semibold text-slate-800">Application deadline</span><br />{job.application_deadline || "Not specified"}</p>
                        </div>
                    </header>

                    <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                        <div className="space-y-6">
                            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="job-description-heading">
                                <h2 id="job-description-heading" className="text-xl font-bold text-slate-900">Job Description</h2>
                                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">{job.description || "No description provided."}</p>
                            </section>

                            {job.skills_required && (
                                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="job-skills-heading">
                                    <h2 id="job-skills-heading" className="text-xl font-bold text-slate-900">Skills</h2>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {job.skills_required.split(",").map((skill) => (
                                            <span key={skill} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">{skill.trim()}</span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {job.company_name && (
                                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="company-heading">
                                    <h2 id="company-heading" className="text-xl font-bold text-slate-900">Company</h2>
                                    <p className="mt-3 text-sm font-semibold text-blue-600">{job.company_name}</p>
                                </section>
                            )}
                        </div>

                        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="apply-heading">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Take the next step</p>
                                    <h2 id="apply-heading" className="mt-2 text-2xl font-bold text-slate-900">Apply for this job</h2>
                                </div>
                                <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${job.status === "OPEN" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{job.status}</span>
                            </div>

                            {job.status === "OPEN" ? (
                                <div className="mt-6">
                                    <label htmlFor="cover-letter" className="mb-2 block text-sm font-semibold text-slate-700">Cover letter</label>
                                    <textarea
                                        id="cover-letter"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        rows="8"
                                        value={coverLetter}
                                        onChange={(event) => setCoverLetter(event.target.value)}
                                        placeholder="Write your cover letter"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleApply}
                                        disabled={hasApplied}
                                        className="mt-4 w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                                    >
                                        {hasApplied ? "Already Applied" : "Apply for this Job"}
                                    </button>
                                </div>
                            ) : (
                                <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">This job is not open for application.</p>
                            )}

                            {applicationMessage && (
                                <p className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${hasApplied ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`} role="status">{applicationMessage}</p>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default JobDetails;
