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
        return <p className="p-6 text-gray-700">Loading jobs...</p>;
    }

    if (error) {
        return <p className="p-6 text-red-600">{error}</p>;
    }

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-6 text-3xl font-bold text-gray-900">
                    Available Jobs
                </h1>

                <div className="mb-6 grid gap-4 rounded-lg bg-white p-4 shadow md:grid-cols-3">
                    <label className="block text-sm font-medium text-gray-700">
                        <span className="mb-1 block">Job title or keyword</span>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Search by title or keyword"
                        />
                    </label>

                    <label className="block text-sm font-medium text-gray-700">
                        <span className="mb-1 block">Location</span>
                        <input
                            type="text"
                            value={location}
                            onChange={(event) => setLocation(event.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Search by location"
                        />
                    </label>

                    <label className="block text-sm font-medium text-gray-700">
                        <span className="mb-1 block">Employment type</span>
                        <select
                            value={employmentType}
                            onChange={(event) => setEmploymentType(event.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="ALL">All Employment Types</option>
                            <option value="FULL_TIME">FULL_TIME</option>
                            <option value="PART_TIME">PART_TIME</option>
                            <option value="INTERNSHIP">INTERNSHIP</option>
                            <option value="CONTRACT">CONTRACT</option>
                        </select>
                    </label>
                </div>

                {jobs.length === 0 ? (
                    <p className="text-gray-700">No jobs available.</p>
                ) : filteredJobs.length === 0 ? (
                    <p className="text-gray-700">No jobs match your search.</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {filteredJobs.map((job) => (
                            <Link key={job.id} to={`/jobs/${job.id}`}>
                                <article className="rounded-lg bg-white p-6 shadow">
                                    <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                                        {job.title}
                                    </h2>
                                    <div className="space-y-2 text-gray-700">
                                        <p>
                                            <strong>Location:</strong> {job.location}
                                        </p>
                                        <p>
                                            <strong>Employment type:</strong>{" "}
                                            {job.employment_type}
                                        </p>
                                        <p>
                                            <strong>Experience required:</strong>{" "}
                                            {job.experience_required}
                                        </p>
                                        <p>
                                            <strong>Description:</strong> {job.description}
                                        </p>
                                        <p>
                                            <strong>Company ID:</strong> {job.company_id}
                                        </p>
                                        <p>
                                            <strong>Application deadline:</strong>{" "}
                                            {job.application_deadline}
                                        </p>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default Jobs;
