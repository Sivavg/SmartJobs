import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSync } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async (showToast = false) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/applications/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApplications(res.data);
            if (showToast) {
                toast.success('Applications refreshed');
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            if (showToast) {
                toast.error('Failed to load applications');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications(false); // Don't show toast on initial load
    }, []);

    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Applications</h1>
                <button
                    onClick={() => fetchApplications(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <FaSync className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>
            {applications.length > 0 ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {applications.map((app) => (
                            <li key={app.id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium text-primary truncate">
                                            <Link to={`/jobs/${app.jobId}`}>{app.job?.title}</Link>
                                        </div>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${app.status === 'Applied' ? 'bg-green-100 text-green-800' :
                                                    app.status === 'Shortlisted' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {app.job?.recruiter?.company?.name || 'Company not specified'}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>
                                                Applied on {new Date(app.appliedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">You haven't applied to any jobs yet.</p>
                    <Link to="/jobs" className="mt-4 inline-block btn btn-primary">Browse Jobs</Link>
                </div>
            )}
        </div>
    );
};

export default MyApplications;
