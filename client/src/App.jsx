import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useInitializeAuth from './hooks/useInitializeAuth';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import JobDetails from './pages/JobDetails';
import MyApplications from './pages/MyApplications';
import Dashboard from './pages/Dashboard';
import CreateJob from './pages/CreateJob';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
    // Initialize auth from localStorage
    useInitializeAuth();

    return (
        <Router>
            <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token?" element={<ResetPassword />} />

                        <Route path="/jobs" element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        } />

                        <Route path="/jobs/:id" element={
                            <ProtectedRoute>
                                <JobDetails />
                            </ProtectedRoute>
                        } />

                        <Route path="/my-applications" element={
                            <ProtectedRoute roles={['candidate']}>
                                <MyApplications />
                            </ProtectedRoute>
                        } />

                        <Route path="/dashboard" element={
                            <ProtectedRoute roles={['recruiter']}>
                                <Dashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/create-job" element={
                            <ProtectedRoute roles={['recruiter']}>
                                <CreateJob />
                            </ProtectedRoute>
                        } />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
                <ToastContainer position="bottom-right" theme="colored" />
            </div>
        </Router>
    );
}

export default App;
