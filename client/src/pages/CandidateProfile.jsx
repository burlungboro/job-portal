import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const emptyProfile = {
    phone: "",
    location: "",
    headline: "",
    bio: "",
};

const CandidateProfile = () => {
    const [profile, setProfile] = useState(emptyProfile);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/candidates/profile");
                const profileData = response.data?.profile ?? response.data;

                if (profileData) {
                    setProfile({
                        phone: profileData.phone || "",
                        location: profileData.location || "",
                        headline: profileData.headline || "",
                        bio: profileData.bio || "",
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
            const response = await api.put("/candidates/profile", profile);
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
                <div className="mb-8 flex items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">Candidate Profile</h1>
                    <Link
                        to="/candidate"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                        <label htmlFor="location" className="mb-1 block text-sm font-medium text-gray-700">
                            Location
                        </label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={profile.location}
                            onChange={handleChange}
                            className={inputClassName}
                        />
                    </div>

                    <div>
                        <label htmlFor="headline" className="mb-1 block text-sm font-medium text-gray-700">
                            Headline
                        </label>
                        <input
                            id="headline"
                            name="headline"
                            type="text"
                            value={profile.headline}
                            onChange={handleChange}
                            className={inputClassName}
                        />
                    </div>

                    <div>
                        <label htmlFor="bio" className="mb-1 block text-sm font-medium text-gray-700">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={profile.bio}
                            onChange={handleChange}
                            className={inputClassName}
                            rows="5"
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

export default CandidateProfile;
