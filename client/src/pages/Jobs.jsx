import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");
    const [employmentType, setEmploymentType] = useState("ALL");
    const [sortBy, setSortBy] = useState("NEWEST");

    const filteredJobs = jobs.filter((job) => {
        const keywordValue = keyword.trim().toLowerCase();
        const locationValue = location.trim().toLowerCase();

        const matchesKeyword =
            !keywordValue ||
            [job.title, job.description, job.skills_required]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(keywordValue));

        const matchesLocation =
            !locationValue ||
            (job.location && job.location.toLowerCase().includes(locationValue));

        const matchesEmploymentType =
            employmentType === "ALL" || job.employment_type === employmentType;

        return matchesKeyword && matchesLocation && matchesEmploymentType;
    });

    const sortedJobs = [...filteredJobs].sort((firstJob, secondJob) => {
        if (sortBy === "NEWEST" || sortBy === "OLDEST") {
            const firstDate = new Date(firstJob.created_at).getTime();
            const secondDate = new Date(secondJob.created_at).getTime();
            const firstValue = Number.isNaN(firstDate) ? 0 : firstDate;
            const secondValue = Number.isNaN(secondDate) ? 0 : secondDate;

            return sortBy === "NEWEST"
                ? secondValue - firstValue
                : firstValue - secondValue;
        }

        const salaryField = sortBy === "SALARY_HIGH" ? "salary_max" : "salary_min";
        const firstSalary = Number(firstJob[salaryField]);
        const secondSalary = Number(secondJob[salaryField]);
        const firstHasSalary = firstJob[salaryField] !== null &&
            firstJob[salaryField] !== undefined &&
            firstJob[salaryField] !== "" &&
            !Number.isNaN(firstSalary);
        const secondHasSalary = secondJob[salaryField] !== null &&
            secondJob[salaryField] !== undefined &&
            secondJob[salaryField] !== "" &&
            !Number.isNaN(secondSalary);

        if (!firstHasSalary && !secondHasSalary) return 0;
        if (!firstHasSalary) return 1;
        if (!secondHasSalary) return -1;

        return sortBy === "SALARY_HIGH"
            ? secondSalary - firstSalary
            : firstSalary - secondSalary;
    });

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
        return (
            <main className="min-h-screen bg-slate-50 p-6 text-slate-900 sm:p-10">
                <div className="mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                    Loading jobs...
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                            J
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            JobPortal
                        </span>
                    </div>

                    <nav className="mt-8 flex gap-2 overflow-x-auto lg:flex-col" aria-label="Main navigation">
                        <Link to="/candidate" className="flex min-w-fit items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                <path d="M4 13h6V4H4v9Zm0 7h6v-4H4v4Zm10 0h6v-9h-6v9Zm0-16v4h6V4h-6Z" />
                            </svg>
                            Dashboard
                        </Link>
                        <Link to="/jobs" className="flex min-w-fit items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
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
                </aside>

                <div className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
                    <header className="border-b border-slate-200 pb-7">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
                            Job opportunities
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Find your next opportunity
                        </h1>
                        <p className="mt-3 text-base text-slate-500">
                            Search and explore available jobs.
                        </p>
                    </header>

                    <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="job-search-heading">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                    <circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" />
                                </svg>
                            </div>
                            <div>
                                <h2 id="job-search-heading" className="font-bold text-slate-900">Search jobs</h2>
                                <p className="text-sm text-slate-500">Refine your search to find the right fit.</p>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <label className="block text-sm font-medium text-slate-700">
                                <span className="mb-2 block">Job title or keyword</span>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                placeholder="Search by title or keyword"
                            />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                <span className="mb-2 block">Location</span>
                        <input
                            type="text"
                            value={location}
                            onChange={(event) => setLocation(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                placeholder="Search by location"
                            />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                <span className="mb-2 block">Employment type</span>
                        <select
                            value={employmentType}
                            onChange={(event) => setEmploymentType(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                            >
                                <option value="ALL">All Employment Types</option>
                                <option value="FULL_TIME">FULL_TIME</option>
                                <option value="PART_TIME">PART_TIME</option>
                                <option value="INTERNSHIP">INTERNSHIP</option>
                                <option value="CONTRACT">CONTRACT</option>
                            </select>
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                <span className="mb-2 block">Sort by</span>
                        <select
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                            >
                                <option value="NEWEST">Newest first</option>
                                <option value="OLDEST">Oldest first</option>
                                <option value="SALARY_HIGH">Highest salary first</option>
                                <option value="SALARY_LOW">Lowest salary first</option>
                            </select>
                            </label>
                        </div>
                    </section>

                    <section className="mt-8" aria-labelledby="available-jobs-heading">
                        <div className="mb-4 flex items-end justify-between gap-4">
                            <div>
                                <h2 id="available-jobs-heading" className="text-lg font-bold text-slate-900">Available jobs</h2>
                                <p className="mt-1 text-sm text-slate-500">Explore roles that match your search.</p>
                            </div>
                        </div>

                        {jobs.length === 0 ? (
                            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                        <path d="M4 7h16M6 7V5h12v2m-14 0v12h16V7M9 12h6" />
                                    </svg>
                                </div>
                                <h3 className="mt-4 font-bold text-slate-900">No jobs available</h3>
                                <p className="mt-2 text-sm text-slate-500">Check back soon for new opportunities.</p>
                            </div>
                        ) : filteredJobs.length === 0 ? (
                            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                        <circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" />
                                    </svg>
                                </div>
                                <h3 className="mt-4 font-bold text-slate-900">No matching jobs</h3>
                                <p className="mt-2 text-sm text-slate-500">Try adjusting your search filters.</p>
                            </div>
                        ) : (
                            <div className="grid gap-5 xl:grid-cols-2">
                                {sortedJobs.map((job) => (
                                    <Link key={job.id} to={`/jobs/${job.id}`} className="group">
                                        <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700">
                                        {job.title}
                                                    </h3>
                                                    <p className="mt-2 text-sm font-semibold text-blue-600">{job.company_name || "Company not specified"}</p>
                                                </div>
                                                <span className="shrink-0 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                                                    {job.employment_type}
                                                </span>
                                            </div>

                                            <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                                                <p><span className="font-semibold text-slate-800">Location:</span> {job.location || "Not specified"}</p>
                                                <p><span className="font-semibold text-slate-800">Salary:</span>{" "}
                                            {job.salary_min !== null &&
                                            job.salary_min !== undefined &&
                                            job.salary_min !== "" &&
                                            job.salary_max !== null &&
                                            job.salary_max !== undefined &&
                                            job.salary_max !== "" ? (
                                                <>
                                                    ₹{Number(job.salary_min).toLocaleString("en-IN")} – ₹
                                                    {Number(job.salary_max).toLocaleString("en-IN")}
                                                </>
                                            ) : job.salary_min !== null &&
                                              job.salary_min !== undefined &&
                                              job.salary_min !== "" ? (
                                                <>₹{Number(job.salary_min).toLocaleString("en-IN")}+</>
                                            ) : job.salary_max !== null &&
                                              job.salary_max !== undefined &&
                                              job.salary_max !== "" ? (
                                                <>Up to ₹{Number(job.salary_max).toLocaleString("en-IN")}</>
                                            ) : (
                                                "Not specified"
                                            )}
                                                </p>
                                                <p><span className="font-semibold text-slate-800">Experience:</span> {job.experience_required || "Not specified"}</p>
                                                <p><span className="font-semibold text-slate-800">Deadline:</span> {job.application_deadline || "Not specified"}</p>
                                            </div>

                                            <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">{job.description || "No description provided."}</p>

                                            {job.skills_required && (
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {job.skills_required.split(",").map((skill) => (
                                                        <span key={skill} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                            {skill.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                                                <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700">View Job</span>
                                                <span className="text-lg text-blue-600 transition group-hover:translate-x-1" aria-hidden="true">-&gt;</span>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}

export default Jobs;
