const CandidateDashboard = () => {
    return (
        <main className="min-h-screen bg-gray-100 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <section className="mb-8 rounded-lg bg-white p-8 shadow-md">
                    <h1 className="mb-2 text-3xl font-bold text-gray-800">
                        Candidate Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Welcome to your Job Portal dashboard
                    </p>
                </section>

                <section className="grid gap-6 md:grid-cols-3">
                    <article className="rounded-lg bg-white p-6 shadow-md">
                        <h2 className="mb-2 text-xl font-semibold text-gray-800">
                            Browse Jobs
                        </h2>
                        <p className="text-gray-600">
                            Explore available job opportunities.
                        </p>
                    </article>

                    <article className="rounded-lg bg-white p-6 shadow-md">
                        <h2 className="mb-2 text-xl font-semibold text-gray-800">
                            My Applications
                        </h2>
                        <p className="text-gray-600">
                            View and manage your job applications.
                        </p>
                    </article>

                    <article className="rounded-lg bg-white p-6 shadow-md">
                        <h2 className="mb-2 text-xl font-semibold text-gray-800">
                            My Profile
                        </h2>
                        <p className="text-gray-600">
                            Review and update your candidate profile.
                        </p>
                    </article>
                </section>
            </div>
        </main>
    );
};

export default CandidateDashboard;