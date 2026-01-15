import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaBuilding, FaClock } from 'react-icons/fa';
import { formatRelativeTime } from '../utils/formatDate';

const JobCard = ({ job }) => {
    const isClosed = job.status === 'closed';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: isClosed ? 0 : -5 }}
            className={`bg-white rounded-xl p-6 shadow-sm border ${isClosed ? 'border-gray-300 opacity-75' : 'border-gray-100'} hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group relative overflow-hidden`}
        >
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${isClosed ? 'from-gray-400 to-gray-500' : 'from-indigo-500 to-violet-500'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

            <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-4">
                    <div className={`bg-gray-50 p-3 rounded-lg border ${isClosed ? 'border-gray-200' : 'border-gray-100'}`}>
                        <FaBuilding className={`${isClosed ? 'text-gray-400' : 'text-indigo-600'} text-xl`} />
                    </div>
                    <div>
                        <h3 className={`text-lg font-bold ${isClosed ? 'text-gray-500' : 'text-gray-900 group-hover:text-indigo-600'} transition-colors duration-200 line-clamp-1`}>
                            {job.title}
                        </h3>
                        <p className="text-sm font-medium text-gray-500">{job.recruiter?.company?.name || 'Company not specified'}</p>
                    </div>
                </div>
                {isClosed ? (
                    <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-semibold border border-gray-300">
                        Closed
                    </span>
                ) : (
                    <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full font-semibold border border-indigo-100">
                        {job.jobType}
                    </span>
                )}
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-500 text-sm">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" />
                    {job.location}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                    <FaBriefcase className="mr-2 text-gray-400" />
                    {job.experienceLevel}
                </div>
                {job.salaryRange && (
                    <div className="flex items-center text-gray-500 text-sm">
                        <FaMoneyBillWave className="mr-2 text-gray-400" />
                        {job.salaryRange}
                    </div>
                )}
                <div className="flex items-center text-gray-400 text-xs mt-2">
                    <FaClock className="mr-1" /> Posted {formatRelativeTime(job.createdAt)}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {job.skills && job.skills.split(',').slice(0, 3).map((skill, index) => (
                    <span key={index} className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded border border-gray-100">
                        {skill.trim()}
                    </span>
                ))}
                {job.skills && job.skills.split(',').length > 3 && (
                    <span className="text-xs text-gray-400 py-1">+ {job.skills.split(',').length - 3} more</span>
                )}
            </div>

            <Link
                to={`/jobs/${job.id}`}
                className={`block w-full text-center ${isClosed ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-default' : 'bg-white border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white'} border font-medium py-2.5 px-4 rounded-lg transition-all duration-300`}
            >
                {isClosed ? 'View Details (Closed)' : 'View Details'}
            </Link>
        </motion.div>
    );
};

export default JobCard;
