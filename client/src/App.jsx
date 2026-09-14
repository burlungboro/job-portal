import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import MyApplications from "./pages/MyApplications";
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
            </Routes>
        </BrowserRouter>
    );
}

export default App;