import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const ApplyModal = ({ isOpen, onClose, jobId, onSuccess }) => {
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { user } = useSelector((state) => state.auth);

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
        setUploadProgress(0); // Reset progress when new file selected
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resume) {
            toast.error('Please upload your resume');
            return;
        }

        const formData = new FormData();
        formData.append('jobId', jobId);
        formData.append('resume', resume);

        setLoading(true);
        setUploadProgress(0);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL}/applications`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                },
            });
            toast.success('Application submitted successfully!');
            // Call onSuccess callback if provided
            if (onSuccess) {
                await onSuccess();
            }
            onClose();
            setResume(null);
            setUploadProgress(0);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit application');
            setUploadProgress(0);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Apply for Job</h3>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" value={user?.name} disabled className="input-field bg-gray-100" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" value={user?.email} disabled className="input-field bg-gray-100" />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF/DOC)</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-primary transition-colors">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="w-full"
                                    />
                                    {resume && (
                                        <p className="text-sm text-gray-600 mt-2">Selected: {resume.name}</p>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                {loading && uploadProgress > 0 && (
                                    <div className="mt-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-700">Uploading...</span>
                                            <span className="text-sm font-medium text-indigo-600">{uploadProgress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="h-2.5 rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-indigo-500 to-purple-600"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        {uploadProgress === 100 && (
                                            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Upload complete!
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>Cancel</button>
                                <button type="submit" disabled={loading || !resume} className="btn btn-primary disabled:opacity-50">
                                    {loading ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ApplyModal;
