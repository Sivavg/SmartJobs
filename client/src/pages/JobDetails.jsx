import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ApplyModal from '../components/ApplyModal';
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaBuilding, FaGlobe, FaClock, FaUsers, FaArrowLeft, FaBookmark, FaShare } from 'react-icons/fa';
import JobCard from '../components/JobCard';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [relatedJobs, setRelatedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [savingJob, setSavingJob] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState(null);
    const [hasApplied, setHasApplied] = useState(false);
    const { user } = useSelector((state) => state.auth);

    // Function to check application status
    const checkApplicationStatus = async () => {
        if (user && user.role === 'candidate') {
            try {
const token = localStorage.getItem('token');
const appStatusRes = await axios.get(`${import.meta.env.VITE_API_URL}/applications/check/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
});
if (appStatusRes.data.hasApplied) {
    setHasApplied(true);
    setApplicationStatus(appStatusRes.data.status);
} else {
    setHasApplied(false);
    setApplicationStatus(null);
}
            } catch (error) {
    console.error('Failed to check application status:', error);
}
        }
    };

useEffect(() => {
    const fetchJobDetails = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/${id}`);
            setJob(res.data);

            const relatedRes = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/${id}/related`);
            setRelatedJobs(relatedRes.data);

            // Check if job is saved and if user has applied (only for authenticated users)
            if (user) {
                const token = localStorage.getItem('token');

                // Check if saved
                const savedRes = await axios.get(`${import.meta.env.VITE_API_URL}/saved-jobs/check/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsSaved(savedRes.data.isSaved);

                // Check application status
                await checkApplicationStatus();
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load job details');
        } finally {
            setLoading(false);
        }
    };
    fetchJobDetails();
}, [id, user]);

const handleSaveToggle = async () => {
    if (!user) {
        toast.error('Please login to save jobs');
        return;
    }

    setSavingJob(true);
    try {
        const token = localStorage.getItem('token');

        if (isSaved) {
            // Unsave the job
            await axios.delete(`${import.meta.env.VITE_API_URL}/saved-jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsSaved(false);
            toast.success('Job removed from saved list');
        } else {
            // Save the job
            await axios.post(`${import.meta.env.VITE_API_URL}/saved-jobs`,
                { jobId: parseInt(id) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsSaved(true);
            toast.success('Job saved successfully!');
        }
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Failed to save job');
    } finally {
        setSavingJob(false);
    }
};

const handleCloseJob = async () => {
    if (window.confirm('Are you sure you want to close this job? It will no longer accept applications.')) {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${import.meta.env.VITE_API_URL}/jobs/${id}/close`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Job closed successfully');
            // Refresh job data
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/${id}`);
            setJob(res.data);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to close job');
        }
    }
};

const handleReopenJob = async () => {
    try {
        const token = localStorage.getItem('token');
        await axios.patch(`${import.meta.env.VITE_API_URL}/jobs/${id}/reopen`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Job reopened successfully');
        // Refresh job data
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/${id}`);
        setJob(res.data);
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Failed to reopen job');
    }
};

const handleDeleteJob = async () => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_URL}/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Job deleted successfully');
            window.location.href = '/jobs';
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete job');
        }
    }
};

if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading job details...</p>
            </div>
        </div>
    );
}

if (!job) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h2>
                <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
                <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
            </div>
        </div>
    );
}

return (
    <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
        >
            <FaArrowLeft />
            <span>Back to Jobs</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
                {/* Job Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <h1 className="text-3xl md:text-4xl font-bold">{job.title}</h1>
                                <button
                                    onClick={async () => {
                                        const shareData = {
                                            title: job.title,
                                            text: `Check out this job: ${job.title} at ${job.recruiter?.company?.name}`,
                                            url: window.location.href
                                        };

                                        try {
                                            if (navigator.share) {
                                                await navigator.share(shareData);
                                                toast.success('Job shared successfully!');
                                            } else {
                                                await navigator.clipboard.writeText(window.location.href);
                                                toast.success('Job link copied to clipboard!');
                                            }
                                        } catch (err) {
                                            if (err.name !== 'AbortError') {
                                                toast.error('Failed to share job');
                                            }
                                        }
                                    }}
                                    className="bg-white/20 hover:bg-white/30 p-2.5 rounded-lg transition-colors"
                                    title="Share this job"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-indigo-100 mb-4">
                                <FaBuilding className="text-lg" />
                                <span className="font-medium text-lg">{job.recruiter?.company?.name || 'Company not specified'}</span>
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm">
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                    <FaMapMarkerAlt />
                                    {job.location}
                                </div>
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                    <FaBriefcase />
                                    {job.jobType}
                                </div>
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                    <FaUsers />
                                    {job.experienceLevel}
                                </div>
                                {job.salaryRange && (
                                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <FaMoneyBillWave />
                                        {job.salaryRange}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {user?.role === 'candidate' && (
                        <div className="flex gap-3">
                            {hasApplied ? (
                                // Show application status if already applied
                                <div className="flex-1 flex items-center justify-between bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl border-2 border-white/50">
                                    <div>
                                        <p className="text-white font-semibold text-lg">Already Applied</p>
                                        <p className="text-indigo-100 text-sm mt-1">
                                            Status: <span className={`font-bold ${applicationStatus === 'Shortlisted' ? 'text-green-300' :
                                                applicationStatus === 'Rejected' ? 'text-red-300' :
                                                    'text-yellow-300'
                                                }`}>{applicationStatus}</span>
                                        </p>
                                    </div>
                                </div>
                            ) : job.status === 'open' ? (
                                <>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="flex-1 bg-white text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                                    >
                                        Apply Now
                                    </button>
                                    <button
                                        onClick={handleSaveToggle}
                                        disabled={savingJob}
                                        className={`${isSaved ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-white/20 hover:bg-white/30'} backdrop-blur-sm p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                                        title={isSaved ? 'Unsave job' : 'Save job'}
                                    >
                                        <FaBookmark className={`text-xl ${isSaved ? 'text-white' : 'text-white'}`} />
                                    </button>
                                </>
                            ) : (
                                <div className="flex-1 bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl text-center cursor-not-allowed">
                                    Job Closed - Applications Not Accepted
                                </div>
                            )}
                        </div>
                    )}

                    {/* Recruiter Actions - only show if user is the job owner */}
                    {user?.role === 'recruiter' && user?.id === job.recruiterId && (
                        <div className="flex gap-3">
                            {job.status === 'open' ? (
                                <button
                                    onClick={handleCloseJob}
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                                >
                                    Close Job
                                </button>
                            ) : (
                                <button
                                    onClick={handleReopenJob}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                                >
                                    Reopen Job
                                </button>
                            )}
                            <button
                                onClick={handleDeleteJob}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Job Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-8"
                >
                    <div className="space-y-8">
                        {/* Description */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-1 h-8 bg-indigo-600 rounded-full"></div>
                                Job Description
                            </h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
                        </div>

                        {/* Requirements */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-1 h-8 bg-purple-600 rounded-full"></div>
                                Requirements
                            </h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.requirements}</p>
                        </div>

                        {/* Skills */}
                        {job.skills && (
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <div className="w-1 h-8 bg-pink-600 rounded-full"></div>
                                    Required Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills.split(',').map((skill, index) => (
                                        <span
                                            key={index}
                                            className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium border border-indigo-200 hover:border-indigo-400 transition-colors"
                                        >
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Posted Date */}
                        <div className="pt-6 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <FaClock />
                                <span>Posted on {new Date(job.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                {/* Company Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
                >
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Company Profile</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                            {/* Company Logo */}
                            {job.recruiter?.company?.logo ? (
                                <div className="flex justify-center mb-4">
                                    <img
                                        src={job.recruiter.company.logo}
                                        alt={job.recruiter?.company?.name || 'Company'}
                                        className="w-20 h-20 object-contain rounded-lg bg-white p-2 shadow-md"
                                    />
                                </div>
                            ) : (
                                <div className="flex justify-center mb-4">
                                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                                        <FaBuilding className="text-3xl text-white" />
                                    </div>
                                </div>
                            )}

                            <h4 className="font-bold text-gray-800 text-lg mb-2 text-center">{job.recruiter?.company?.name || 'Company not specified'}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {job.recruiter?.company?.about || 'No description available.'}
                            </p>
                        </div>

                        {job.recruiter?.company?.website && (
                            <a
                                href={job.recruiter.company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors group"
                            >
                                <FaGlobe className="group-hover:scale-110 transition-transform" />
                                <span className="group-hover:underline">Visit Website</span>
                            </a>
                        )}
                    </div>
                </motion.div>

                {/* Related Jobs */}
                {relatedJobs.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Related Jobs</h3>
                        <div className="space-y-4">
                            {relatedJobs.map(relatedJob => (
                                <JobCard key={relatedJob.id} job={relatedJob} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>

        {/* Apply Modal */}
        <ApplyModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            jobId={job.id}
            onSuccess={checkApplicationStatus}
        />
    </div>
);
};

export default JobDetails;

