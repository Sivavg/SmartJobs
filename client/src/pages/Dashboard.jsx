import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUsers, FaBriefcase, FaCheckCircle, FaPlus, FaSpinner } from 'react-icons/fa';
import ApplicationsTable from '../components/recruiter/ApplicationsTable';
import ApplicationsPerJobChart from '../components/recruiter/charts/ApplicationsPerJobChart';
import StatusDistributionChart from '../components/recruiter/charts/StatusDistributionChart';
import JobsVsApplicationsTrendChart from '../components/recruiter/charts/JobsVsApplicationsTrendChart';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [stats, setStats] = useState({ posted: 0, applications: 0, shortlisted: 0 });
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // 1. Fetch jobs posted by this recruiter
            const jobsRes = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/my-jobs`, config);
            const jobs = jobsRes.data;

            // 2. Optimized: Fetch applications in parallel (Promise.all) instead of a loop
            // This is much faster and prevents UI lag
            const applicationPromises = jobs.map((job) =>
                axios.get(`${import.meta.env.VITE_API_URL}/applications/job/${job.id}`, config)
                    .then(res => res.data.map(app => ({ ...app, job }))) // Attach job info to application
                    .catch(() => []) // Handle individual errors without breaking the dashboard
            );

            const applicationsResults = await Promise.all(applicationPromises);
            const allApplications = applicationsResults.flat(); // Flatten array of arrays

            // 3. Update State
            setJobs(jobs);
            setApplications(allApplications);
            setStats({
                posted: jobs.length,
                applications: allApplications.length,
                shortlisted: allApplications.filter(app => app.status === 'Shortlisted').length
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_API_URL}/applications/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Application ${status} successfully`);
            fetchData(); // Refresh data to reflect changes
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-800">Recruiter Dashboard</h1>
                    <p className="text-gray-500 mt-1">Overview of your jobs and candidates</p>
                </div>
                <Link
                    to="/create-job"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg transition-all transform hover:scale-105"
                >
                    <FaPlus /> Post New Job
                </Link>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <StatCard
                    title="Jobs Posted"
                    count={stats.posted}
                    icon={<FaBriefcase size={24} />}
                    color="blue"
                />
                <StatCard
                    title="Total Applications"
                    count={stats.applications}
                    icon={<FaUsers size={24} />}
                    color="green"
                />
                <StatCard
                    title="Shortlisted"
                    count={stats.shortlisted}
                    icon={<FaCheckCircle size={24} />}
                    color="purple"
                />
            </div>

            {/* Analytics Charts Section */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics Overview</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <ApplicationsPerJobChart applications={applications} jobs={jobs} />
                    <StatusDistributionChart applications={applications} />
                </div>
                <div className="grid grid-cols-1 gap-6">
                    <JobsVsApplicationsTrendChart jobs={jobs} applications={applications} />
                </div>
            </div>

            {/* Applications Table Section */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h2 className="text-xl font-bold text-gray-800">Recent Applications</h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {applications.length} Candidates
                    </span>
                </div>

                <div className="p-0">
                    {applications.length > 0 ? (
                        /* overflow-x-auto fixes the overlap issue on small screens */
                        <div className="overflow-x-auto w-full">
                            <ApplicationsTable
                                applications={applications}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        </div>
                    ) : (
                        <div className="text-center py-12 px-4">
                            <div className="bg-gray-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                                <FaUsers className="text-gray-400 text-2xl" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
                            <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                                Once candidates apply to your posted jobs, they will appear here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Reusable Component for Cards to ensure consistent design
const StatCard = ({ title, count, icon, color }) => {
    const colorClasses = {
        blue: "text-blue-600 bg-blue-100 border-blue-500",
        green: "text-green-600 bg-green-100 border-green-500",
        purple: "text-purple-600 bg-purple-100 border-purple-500"
    };

    return (
        <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${colorClasses[color].split(' ')[2]} hover:shadow-md transition-shadow duration-300 flex items-center justify-between`}>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wide">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{count}</p>
            </div>
            {/* flex-shrink-0 prevents icon from getting squashed or overlapping */}
            <div className={`p-4 rounded-full flex-shrink-0 ${colorClasses[color].split(' ')[1]} ${colorClasses[color].split(' ')[0]}`}>
                {icon}
            </div>
        </div>
    );
};

export default Dashboard;