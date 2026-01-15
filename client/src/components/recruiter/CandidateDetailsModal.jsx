import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUser, FaEnvelope, FaFileAlt, FaBriefcase, FaCalendar } from 'react-icons/fa';
import { formatDate } from '../../utils/formatDate';

const CandidateDetailsModal = ({ isOpen, onClose, candidate, application }) => {
    if (!candidate || !application) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                    />

                    {/* Modal */}
                    <div className="flex min-h-full items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>

                                {/* Profile Section */}
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <FaUser className="w-10 h-10 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold">{candidate.name}</h2>
                                        <p className="text-indigo-100 flex items-center gap-2 mt-1">
                                            <FaEnvelope className="w-4 h-4" />
                                            {candidate.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                                {/* Application Info */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <FaBriefcase className="text-indigo-600" />
                                        Application Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Job Position</p>
                                            <p className="font-semibold text-gray-900">{application.job?.title}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Applied Date</p>
                                            <p className="font-semibold text-gray-900 flex items-center gap-1">
                                                <FaCalendar className="w-3 h-3 text-gray-400" />
                                                {formatDate(application.appliedAt)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Status</p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${application.status === 'Shortlisted' ? 'bg-green-100 text-green-800' :
                                                application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                {application.status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Resume</p>
                                            <a
                                                href={`https://smart-y0pk.onrender.com/${application.resumeUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold text-sm hover:underline"
                                            >
                                                <FaFileAlt className="w-3 h-3" />
                                                View Resume
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Candidate Bio/Additional Info */}
                                {candidate.bio && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                                        <p className="text-gray-600 leading-relaxed">{candidate.bio}</p>
                                    </div>
                                )}

                                {/* Contact Information */}
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FaEnvelope className="w-4 h-4 text-gray-400" />
                                            <a href={`mailto:${candidate.email}`} className="hover:text-indigo-600 hover:underline">
                                                {candidate.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CandidateDetailsModal;
