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
                        <ProtectedRoute>
                            <Jobs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/jobs/:id"
                    element={
                        <ProtectedRoute>
                            <JobDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/candidate"
                    element={
                        <ProtectedRoute>
                            <CandidateDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/candidate/profile"
                    element={
                        <ProtectedRoute>
                            <CandidateProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter"
                    element={
                        <ProtectedRoute>
                            <RecruiterDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/applications"
                    element={
                        <ProtectedRoute>
                            <MyApplications />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/applications"
                    element={
                        <ProtectedRoute>
                            <RecruiterApplications />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/jobs"
                    element={
                        <ProtectedRoute>
                            <ManageJobs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/jobs/create"
                    element={
                        <ProtectedRoute>
                            <CreateJob />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter/jobs/:id/edit"
                    element={
                        <ProtectedRoute>
                            <EditJob />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;