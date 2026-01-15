import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { FaBriefcase, FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaPlusCircle, FaFileAlt, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        setIsOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 glass mb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to={user ? "/jobs" : "/login"} className="flex items-center space-x-2 group">
                            <div className="bg-gradient-to-br from-indigo-500 to-pink-500 text-white p-2.5 rounded-xl shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                                <FaBriefcase size={22} />
                            </div>
                            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 tracking-tight">
                                SmartJobs
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {user ? (
                            <>
                                <Link
                                    to="/jobs"
                                    className={`text-sm font-semibold transition-colors duration-200 ${isActive('/jobs') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                                >
                                    Find Jobs
                                </Link>
                                {user.role === 'candidate' && (
                                    <Link
                                        to="/my-applications"
                                        className={`flex items-center space-x-1 text-sm font-semibold transition-colors duration-200 ${isActive('/my-applications') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                                    >
                                        <FaFileAlt /> <span>My Applications</span>
                                    </Link>
                                )}
                                {user.role === 'recruiter' && (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            className={`flex items-center space-x-1 text-sm font-semibold transition-colors duration-200 ${isActive('/dashboard') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
                                        >
                                            <FaTachometerAlt /> <span>Dashboard</span>
                                        </Link>
                                        <Link
                                            to="/create-job"
                                            className="btn btn-primary px-5 py-2 text-sm shadow-indigo-500/30"
                                        >
                                            <FaPlusCircle /> <span>Post Job</span>
                                        </Link>
                                    </>
                                )}

                                <div className="h-8 w-px bg-gray-200 mx-2"></div>

                                <div className="flex items-center space-x-3 group relative cursor-pointer">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-bold text-gray-800">{user.name}</span>
                                        <span className="text-xs text-indigo-500 font-medium capitalize">{user.role}</span>
                                    </div>
                                    <div className="bg-gradient-to-tr from-indigo-100 to-purple-100 p-1 rounded-full border-2 border-white shadow-sm">
                                        <div className="bg-indigo-500 text-white p-1.5 rounded-full">
                                            <FaUserCircle size={20} />
                                        </div>
                                    </div>

                                    <div className="absolute top-full right-0 mt-4 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center space-x-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                        >
                                            <FaSignOutAlt /> <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-semibold transition-colors">Login</Link>
                                <Link to="/register" className="btn btn-primary shadow-lg shadow-indigo-500/30">Register</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-indigo-600 focus:outline-none">
                            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {user ? (
                                <>
                                    <div className="flex items-center space-x-3 px-3 py-3 border-b border-gray-100 mb-2">
                                        <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                                            <FaUserCircle size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{user.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                    <Link
                                        to="/jobs"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                                    >
                                        Find Jobs
                                    </Link>
                                    {user.role === 'candidate' && (
                                        <Link
                                            to="/my-applications"
                                            onClick={() => setIsOpen(false)}
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                                        >
                                            My Applications
                                        </Link>
                                    )}
                                    {user.role === 'recruiter' && (
                                        <>
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setIsOpen(false)}
                                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/create-job"
                                                onClick={() => setIsOpen(false)}
                                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                                            >
                                                Post Job
                                            </Link>
                                        </>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-3 pt-4">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full text-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
