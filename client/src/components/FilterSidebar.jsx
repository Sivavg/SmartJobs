import { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaFilter, FaTimes, FaChevronDown } from 'react-icons/fa';

const FilterSidebar = ({ onFilter }) => {
    // State for toggling filter on mobile
    const [isOpen, setIsOpen] = useState(false);

    const [filters, setFilters] = useState({
        title: '',
        location: '',
        jobType: '',
        experienceLevel: '',
        sort: 'newest'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        onFilter(newFilters);
    };

    const handleReset = () => {
        const resetState = {
            title: '',
            location: '',
            jobType: '',
            experienceLevel: '',
            sort: 'newest'
        };
        setFilters(resetState);
        onFilter(resetState);
    };

    return (
        <div className="w-full">
            {/* Mobile Toggle Button (Visible only on small screens) */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <FaFilter className="text-indigo-600" />
                    <span>Filter Jobs</span>
                </div>
                <FaChevronDown className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Sidebar Container (Hidden on mobile unless open, always visible on Desktop) */}
            <div className={`bg-white p-6 rounded-xl shadow-md border border-gray-200 sticky top-24 transition-all duration-300 ${isOpen ? 'block' : 'hidden'} lg:block`}>
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <FaFilter className="text-indigo-600 text-lg" />
                        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    </div>
                    {/* Clear Filters Button */}
                    <button 
                        onClick={handleReset}
                        className="text-xs font-medium text-gray-500 hover:text-indigo-600 underline transition-colors"
                    >
                        Clear all
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Search Input */}
                    <div className="group">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                            </div>
                            <input
                                type="text"
                                name="title"
                                placeholder="Job title or keyword"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                value={filters.title}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Location Input */}
                    <div className="group">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaMapMarkerAlt className="text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                            </div>
                            <input
                                type="text"
                                name="location"
                                placeholder="City or Country"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                value={filters.location}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Job Type Select */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Job Type</label>
                        <select 
                            name="jobType" 
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                            value={filters.jobType} 
                            onChange={handleChange}
                        >
                            <option value="">All Types</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>

                    {/* Experience Level Select */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Experience Level</label>
                        <select 
                            name="experienceLevel" 
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                            value={filters.experienceLevel} 
                            onChange={handleChange}
                        >
                            <option value="">All Levels</option>
                            <option value="Entry Level">Entry Level</option>
                            <option value="Mid Level">Mid Level</option>
                            <option value="Senior Level">Senior Level</option>
                        </select>
                    </div>

                    {/* Sort By Select */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sort By</label>
                        <select 
                            name="sort" 
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                            value={filters.sort} 
                            onChange={handleChange}
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;