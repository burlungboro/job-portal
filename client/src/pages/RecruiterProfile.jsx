import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyProfile = {
    company_name: "",
    company_id: "",
    phone: "",
    job_title: "",
};

const RecruiterProfile = () => {
    const [profile, setProfile] = useState(emptyProfile);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/recruiters/profile");
                const profileData = response.data?.profile ?? response.data;

                if (profileData) {
                    setProfile({
                        company_name: profileData.company_name || "",
                        company_id: profileData.company_id || "",
                        phone: profileData.phone || "",
                        job_title: profileData.job_title || "",
                    });
                }
            } catch (error) {
                if (error.response?.status !== 404) {
                    setLoadError(
                        error.response?.data?.message ||
                            error.response?.data?.error ||
                            "Unable to load your profile. Please try again later."
                    );
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfile((currentProfile) => ({
            ...currentProfile,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setMessage("");
        setMessageType("");

        try {
            const { company_id, phone, job_title } = profile;
            const response = await api.put("/recruiters/profile", {
                company_id,
                phone,
                job_title,
            });
            setMessage(response.data?.message || "Profile saved successfully.");
            setMessageType("success");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Unable to save your profile. Please try again."
            );
            setMessageType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClassName =
        "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

    if (isLoading) {
        return (
            <main className="min-h-screen bg-gray-100 px-4 py-10 sm:px-6 lg:px-8">
                <p className="mx-auto max-w-3xl text-gray-700">Loading profile...</p>
            </main>
        );
    }

    if (loadError) {
        return (
            <main className="min-h-screen bg-gray-100 px-4 py-10 sm:px-6 lg:px-8">
                <p className="mx-auto max-w-3xl text-red-600">{loadError}</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md sm:p-8">
                <h1 className="mb-8 text-3xl font-bold text-gray-800">Recruiter Profile</h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <span className="mb-1 block text-sm font-medium text-gray-700">Company Name</span>
                        <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700">
                            {profile.company_name || "No company assigned"}
                        </p>
                    </div>

                    <div>
                        <label htmlFor="company_id" className="mb-1 block text-sm font-medium text-gray-700">
                            Company ID
                        </label>
                        <input
                            id="company_id"
                            name="company_id"
                            type="text"
                            value={profile.company_id}
                            onChange={handleChange}
                            className={inputClassName}
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
                            Phone
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={profile.phone}
                            onChange={handleChange}
                            className={inputClassName}
                        />
                    </div>

                    <div>
                        <label htmlFor="job_title" className="mb-1 block text-sm font-medium text-gray-700">
                            Job Title
                        </label>
                        <input
                            id="job_title"
                            name="job_title"
                            type="text"
                            value={profile.job_title}
                            onChange={handleChange}
                            className={inputClassName}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                        {isSubmitting ? "Saving..." : "Save Profile"}
                    </button>
                </form>

                {message && (
                    <p
                        className={`mt-5 text-center text-sm ${
                            messageType === "success" ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </main>
    );
};

export default RecruiterProfile;
