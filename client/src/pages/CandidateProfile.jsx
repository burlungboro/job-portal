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
    const [selectedResumeFile, setSelectedResumeFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedResumeUrl, setUploadedResumeUrl] = useState("");
    const [selectedProfilePictureFile, setSelectedProfilePictureFile] = useState(null);
    const [isUploadingProfilePicture, setIsUploadingProfilePicture] = useState(false);
    const [profilePictureUrl, setProfilePictureUrl] = useState("");
    const [loadError, setLoadError] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/candidates/profile");
                const profileData = response.data?.profile ?? response.data;

                if (profileData) {
                    setUploadedResumeUrl(profileData.resume_url || "");
                    setProfilePictureUrl(profileData.profile_picture || "");
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
        setMessage("");
        setMessageType("");

        if (profile.phone && !/^[\d\s()+-]+$/.test(profile.phone)) {
            setMessage("Phone can only contain digits, spaces, +, -, and parentheses.");
            setMessageType("error");
            return;
        }

        if (profile.headline.length > 200) {
            setMessage("Headline must be 200 characters or fewer.");
            setMessageType("error");
            return;
        }

        if (profile.bio.length > 2000) {
            setMessage("Bio must be 2000 characters or fewer.");
            setMessageType("error");
            return;
        }

        setIsSubmitting(true);

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

    const handleResumeUpload = async () => {
        if (!selectedResumeFile) {
            setMessage("Please select a resume file first.");
            setMessageType("error");
            return;
        }
        

        setIsUploading(true);
        setMessage("");
        setMessageType("");

        const formData = new FormData();
        formData.append("resume", selectedResumeFile);

        try {
            const response = await api.post("/candidates/resume", formData);
            setUploadedResumeUrl(response.data?.resume_url || "");
            setMessage(response.data?.message || "Resume uploaded successfully.");
            setMessageType("success");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Unable to upload your resume. Please try again."
            );
            setMessageType("error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleProfilePictureUpload = async () => {
        if (!selectedProfilePictureFile) {
            setMessage("Please select a profile picture first.");
            setMessageType("error");
            return;
        }

        setIsUploadingProfilePicture(true);
        setMessage("");
        setMessageType("");

        const formData = new FormData();
        formData.append("profile_picture", selectedProfilePictureFile);

        try {
            const response = await api.post("/candidates/profile-picture", formData);
            setProfilePictureUrl(response.data?.profile_picture || "");
            setMessage(response.data?.message || "Profile picture uploaded successfully.");
            setMessageType("success");
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Unable to upload your profile picture. Please try again."
            );
            setMessageType("error");
        } finally {
            setIsUploadingProfilePicture(false);
        }
    };

    const inputClassName =
        "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";
    const completedProfileItems = [
        profile.phone,
        profile.location,
        profile.headline,
        profile.bio,
        uploadedResumeUrl,
        profilePictureUrl,
    ].filter(Boolean).length;
    const profileCompletion = Math.round((completedProfileItems / 6) * 100);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-slate-50 p-6 text-slate-900 sm:p-10">
                <div className="mx-auto max-w-6xl rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">Loading profile...</div>
            </main>
        );
    }

    if (loadError) {
        return (
            <main className="min-h-screen bg-slate-50 p-6 text-slate-900 sm:p-10">
                <div className="mx-auto max-w-6xl rounded-xl border border-rose-200 bg-white p-8 text-center text-sm text-rose-600">{loadError}</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
                <aside className="flex w-full flex-col border-b border-slate-200 bg-white px-5 py-5 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
                    <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">J</div><span className="text-xl font-bold tracking-tight text-slate-900">JobPortal</span></div>
                    <nav className="mt-8 flex gap-2 overflow-x-auto lg:flex-col" aria-label="Main navigation">
                        <Link to="/candidate" className="flex min-w-fit items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">Dashboard</Link>
                        <Link to="/jobs" className="flex min-w-fit items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">Browse Jobs</Link>
                        <Link to="/applications" className="flex min-w-fit items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">My Applications</Link>
                        <Link to="/candidate/profile" className="flex min-w-fit items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">Profile</Link>
                    </nav>
                </aside>

                <div className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
                    <header className="flex items-end justify-between gap-4 border-b border-slate-200 pb-7">
                        <div><p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">My profile</p><h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Candidate Profile</h1><p className="mt-3 max-w-2xl text-base text-slate-500">Maintain your professional profile so employers can get to know your experience and strengths.</p></div>
                        <Link to="/candidate" className="hidden shrink-0 text-sm font-semibold text-blue-600 hover:text-blue-700 sm:block">Back to Dashboard</Link>
                    </header>

                    <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
                        <form onSubmit={handleSubmit} className="order-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:order-1">
                            <div className="mb-6"><h2 className="text-lg font-bold text-slate-900">Profile information</h2><p className="mt-1 text-sm text-slate-500">Keep your contact details and professional summary up to date.</p></div>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div><label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">Phone</label><input id="phone" name="phone" type="tel" value={profile.phone} onChange={handleChange} className={inputClassName} maxLength={20} /></div>
                                <div><label htmlFor="location" className="mb-2 block text-sm font-semibold text-slate-700">Location</label><input id="location" name="location" type="text" value={profile.location} onChange={handleChange} className={inputClassName} maxLength={150} /></div>
                            </div>
                            <div className="mt-5"><label htmlFor="headline" className="mb-2 block text-sm font-semibold text-slate-700">Headline</label><input id="headline" name="headline" type="text" value={profile.headline} onChange={handleChange} className={inputClassName} maxLength={200} /><p className="mt-2 text-right text-xs font-medium text-slate-400">{profile.headline.length} / 200</p></div>
                            <div className="mt-5"><label htmlFor="bio" className="mb-2 block text-sm font-semibold text-slate-700">Bio</label><textarea id="bio" name="bio" value={profile.bio} onChange={handleChange} className={inputClassName} rows="6" maxLength={2000} /><p className="mt-2 text-right text-xs font-medium text-slate-400">{profile.bio.length} / 2000</p></div>
                            <button type="submit" disabled={isSubmitting} className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">{isSubmitting ? "Saving..." : "Save Profile"}</button>
                        </form>

                        <div className="order-1 flex flex-col gap-6 xl:order-2">
                            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-slate-500">Profile completion</p><p className="mt-2 text-4xl font-bold tracking-tight text-blue-600">{profileCompletion}%</p></div><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><span className="text-xl font-bold">✓</span></div></div><div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${profileCompletion}%` }} /></div><p className="mt-3 text-xs text-slate-500">Complete your profile to stand out to employers.</p></section>

                            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5"><h2 className="font-bold text-slate-900">Profile picture</h2><p className="mt-1 text-sm text-slate-500">Use a professional photo.</p></div><div className="flex flex-col items-center">{profilePictureUrl ? <img src={`http://localhost:5000${profilePictureUrl}`} alt="Profile" className="mb-5 h-28 w-28 rounded-full object-cover ring-4 ring-blue-50" /> : <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-400">No photo</div>}<input id="profile-picture" name="profile_picture" type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(event) => { setSelectedProfilePictureFile(event.target.files?.[0] || null); }} className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100" /><button type="button" onClick={handleProfilePictureUpload} disabled={isUploadingProfilePicture} className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">{isUploadingProfilePicture ? "Uploading..." : "Upload Profile Picture"}</button></div></section>

                            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5"><h2 className="font-bold text-slate-900">Resume</h2><p className="mt-1 text-sm text-slate-500">Share your latest resume.</p></div><input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" onChange={(event) => { setSelectedResumeFile(event.target.files?.[0] || null); }} className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-sky-700 hover:file:bg-sky-100" /><button type="button" onClick={handleResumeUpload} disabled={isUploading} className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">{isUploading ? "Uploading..." : "Upload Resume"}</button>{uploadedResumeUrl && <a href={`http://localhost:5000${uploadedResumeUrl}`} target="_blank" rel="noopener noreferrer" className="mt-4 block text-center text-sm font-semibold text-blue-600 hover:text-blue-700">View Resume <span aria-hidden="true">-&gt;</span></a>}</section>
                        </div>
                    </div>

                    {message && <p className={`mt-6 rounded-xl border px-4 py-3 text-center text-sm font-medium ${messageType === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>{message}</p>}
                </div>
            </div>
        </main>
    );
};

export default CandidateProfile;
