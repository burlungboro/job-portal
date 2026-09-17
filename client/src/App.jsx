import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterApplications from "./pages/RecruiterApplications";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import ManageJobs from "./pages/ManageJobs";
import MyApplications from "./pages/MyApplications";
import CandidateProfile from "./pages/CandidateProfile";
import RecruiterProfile from "./pages/RecruiterProfile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/jobs"
                    element={
                        <ProtectedRoute allowedRoles={["CANDIDATE"]}>
                            <Jobs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/jobs/:id"
                    element={
                        <ProtectedRoute allowedRoles={["CANDIDATE"]}>
                            <JobDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/candidate"
                    element={
                        <ProtectedRoute allowedRoles={["CANDIDATE"]}>
                            <CandidateDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/candidate/profile"
                    element={
                        <ProtectedRoute allowedRoles={["CANDIDATE"]}>
                            <CandidateProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter"
                    element={
                        <ProtectedRoute allowedRoles={["RECRUITER"]}>
                            <RecruiterDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/profile"
                    element={
                        <ProtectedRoute allowedRoles={["RECRUITER"]}>
                            <RecruiterProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/applications"
                    element={
                        <ProtectedRoute allowedRoles={["CANDIDATE"]}>
                            <MyApplications />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/applications"
                    element={
                        <ProtectedRoute allowedRoles={["RECRUITER"]}>
                            <RecruiterApplications />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/jobs"
                    element={
                        <ProtectedRoute allowedRoles={["RECRUITER"]}>
                            <ManageJobs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/jobs/create"
                    element={
                        <ProtectedRoute allowedRoles={["RECRUITER"]}>
                            <CreateJob />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/jobs/:id/edit"
                    element={
                        <ProtectedRoute allowedRoles={["RECRUITER"]}>
                            <EditJob />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;