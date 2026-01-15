import { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';
import FilterSidebar from '../components/FilterSidebar';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../hooks/useDebounce';
import { FaFilter, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Home = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);
    const debouncedFilters = useDebounce(filters, 500);

    const fetchJobs = async (filterParams = {}, page = 1) => {
        setLoading(true);
        try {
            const params = { ...filterParams, page, limit: 10 };
            const query = new URLSearchParams(params).toString();
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/jobs?${query}`);
            setJobs(res.data.jobs);
            setTotalJobs(res.data.pagination.total);
            setTotalPages(res.data.pagination.totalPages);
            setCurrentPage(res.data.pagination.currentPage);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs(debouncedFilters, 1);
        setCurrentPage(1); // Reset to page 1 when filters change
    }, [debouncedFilters]);

    const handleFilter = (newFilters) => {
        setFilters(newFilters);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchJobs(debouncedFilters, newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl overflow-hidden mb-12 shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-sm"
                    >
                        Find Your Dream Job Today
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto font-medium"
                    >
                        Discover thousands of job opportunities from top companies. Your next career move starts here.
                    </motion.p>
                </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
                <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="w-full flex items-center justify-center space-x-2 bg-white p-3 rounded-xl shadow-sm border border-gray-200 text-gray-700 font-semibold"
                >
                    <FaFilter /> <span>{showMobileFilters ? 'Hide Filters' : 'Show Filters'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar - Desktop & Mobile */}
                <div className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                    <FilterSidebar onFilter={handleFilter} />
                </div>

                <div className="lg:col-span-3">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Latest Opportunities</h2>
                        <span className="bg-white px-3 py-1 rounded-full text-indigo-600 text-sm font-semibold shadow-sm border border-gray-100">
                            {totalJobs} jobs found
                        </span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-64 animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : jobs.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {jobs.map(job => (
                                    <JobCard key={job.id} job={job} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:shadow-md'
                                            }`}
                                    >
                                        <FaChevronLeft size={12} />
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                            // Show first page, last page, current page, and pages around current
                                            if (
                                                page === 1 ||
                                                page === totalPages ||
                                                (page >= currentPage - 1 && page <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePageChange(page)}
                                                        className={`min-w-[40px] h-10 rounded-lg font-semibold transition-all ${currentPage === page
                                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                                                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-indigo-50 hover:border-indigo-300'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            } else if (
                                                page === currentPage - 2 ||
                                                page === currentPage + 2
                                            ) {
                                                return (
                                                    <span key={page} className="px-2 text-gray-400">
                                                        ...
                                                    </span>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:shadow-md'
                                            }`}
                                    >
                                        Next
                                        <FaChevronRight size={12} />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="mx-auto h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                <FaFilter size={24} />
                            </div>
                            <h3 className="mt-2 text-lg font-bold text-gray-900">No jobs found</h3>
                            <p className="mt-1 text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
