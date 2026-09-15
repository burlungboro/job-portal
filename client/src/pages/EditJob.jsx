import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [employmentType, setEmploymentType] = useState("FULL_TIME");
    const [salaryMin, setSalaryMin] = useState("");
    const [salaryMax, setSalaryMax] = useState("");
    const [experienceRequired, setExperienceRequired] = useState("");
    const [skillsRequired, setSkillsRequired] = useState("");
    const [applicationDeadline, setApplicationDeadline] = useState("");
    const [companyId, setCompanyId] = useState("");
    const [status, setStatus] = useState("DRAFT");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await api.get(`/jobs/${id}`);
                const job = response.data;

                setTitle(job.title || "");
                setDescription(job.description || "");
                setLocation(job.location || "");
                setEmploymentType(job.employment_type || "FULL_TIME");
                setSalaryMin(job.salary_min ?? "");
                setSalaryMax(job.salary_max ?? "");
                setExperienceRequired(job.experience_required || "");
                setSkillsRequired(job.skills_required || "");
                setApplicationDeadline(job.application_deadline?.slice(0, 10) || "");
                setCompanyId(job.company_id ?? "");
                setStatus(job.status || "DRAFT");
            } catch (error) {
                setLoadError(
                    error.response?.data?.message ||
                        error.response?.data?.error ||
                        "Unable to load this job. Please try again later."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setMessage("");

        try {
            const response = await api.put(`/jobs/${id}`, {
                company_id: companyId,
                title,
                description,
                location,
                employment_type: employmentType,
                salary_min: salaryMin || null,
                salary_max: salaryMax || null,
                experience_required: experienceRequired,
                skills_required: skillsRequired,
                application_deadline: applicationDeadline || null,
                status,
            });

            setMessage(response.data?.message || "Job updated successfully!");
            setTimeout(() => navigate("/recruiter/jobs"), 1000);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClassName =
        "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

    if (isLoading) {
        return <p className="p-6 text-gray-700">Loading job...</p>;
    }

    if (loadError) {
        return <p className="p-6 text-red-600">{loadError}</p>;
    }

    return (
        <main className="min-h-screen bg-gray-100 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md sm:p-8">
                <div className="mb-8 flex items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">Edit Job</h1>
                    <Link
                        to="/recruiter/jobs"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        Back to Manage Jobs
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
                            Job Title
                        </label>
                        <input id="title" type="text" value={title} onChange={(event) => setTitle(event.target.value)} className={inputClassName} required />
                    </div>

                    <div>
                        <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
                            Job Description
                        </label>
                        <textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} className={inputClassName} rows="5" required />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="location" className="mb-1 block text-sm font-medium text-gray-700">
                                Location
                            </label>
                            <input id="location" type="text" value={location} onChange={(event) => setLocation(event.target.value)} className={inputClassName} />
                        </div>

                        <div>
                            <label htmlFor="employmentType" className="mb-1 block text-sm font-medium text-gray-700">
                                Employment Type
                            </label>
                            <select id="employmentType" value={employmentType} onChange={(event) => setEmploymentType(event.target.value)} className={`${inputClassName} bg-white`}>
                                <option value="FULL_TIME">FULL_TIME</option>
                                <option value="PART_TIME">PART_TIME</option>
                                <option value="INTERNSHIP">INTERNSHIP</option>
                                <option value="CONTRACT">CONTRACT</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="salaryMin" className="mb-1 block text-sm font-medium text-gray-700">
                                Minimum Salary
                            </label>
                            <input id="salaryMin" type="number" value={salaryMin} onChange={(event) => setSalaryMin(event.target.value)} className={inputClassName} min="0" />
                        </div>

                        <div>
                            <label htmlFor="salaryMax" className="mb-1 block text-sm font-medium text-gray-700">
                                Maximum Salary
                            </label>
                            <input id="salaryMax" type="number" value={salaryMax} onChange={(event) => setSalaryMax(event.target.value)} className={inputClassName} min="0" />
                        </div>

                        <div>
                            <label htmlFor="experienceRequired" className="mb-1 block text-sm font-medium text-gray-700">
                                Experience Required
                            </label>
                            <input id="experienceRequired" type="text" value={experienceRequired} onChange={(event) => setExperienceRequired(event.target.value)} className={inputClassName} />
                        </div>

                        <div>
                            <label htmlFor="applicationDeadline" className="mb-1 block text-sm font-medium text-gray-700">
                                Application Deadline
                            </label>
                            <input id="applicationDeadline" type="date" value={applicationDeadline} onChange={(event) => setApplicationDeadline(event.target.value)} className={inputClassName} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="skillsRequired" className="mb-1 block text-sm font-medium text-gray-700">
                            Required Skills
                        </label>
                        <input id="skillsRequired" type="text" value={skillsRequired} onChange={(event) => setSkillsRequired(event.target.value)} className={inputClassName} placeholder="Example: React, Node.js, SQL" />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="companyId" className="mb-1 block text-sm font-medium text-gray-700">
                                Company ID
                            </label>
                            <input id="companyId" type="number" value={companyId} onChange={(event) => setCompanyId(event.target.value)} className={inputClassName} min="1" required />
                        </div>

                        <div>
                            <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
                                Job Status
                            </label>
                            <select id="status" value={status} onChange={(event) => setStatus(event.target.value)} className={`${inputClassName} bg-white`}>
                                <option value="DRAFT">DRAFT</option>
                                <option value="OPEN">OPEN</option>
                                <option value="CLOSED">CLOSED</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </form>

                {message && <p className="mt-5 text-center text-sm text-gray-600">{message}</p>}
            </div>
        </main>
    );
};

export default EditJob;
