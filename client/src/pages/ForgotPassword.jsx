import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaEnvelope, FaKey, FaCopy, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });
            setToken(res.data.token);
            toast.success('Reset token generated! Copy it and use it to reset your password.');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to generate reset token');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(token);
        setCopied(true);
        toast.success('Token copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4"
                    >
                        <FaKey className="text-white text-3xl" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                    <p className="text-gray-600">Enter your email to receive a password reset token</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {!token ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-400 text-lg" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
                            >
                                {loading ? 'Generating Token...' : 'Get Reset Token'}
                            </motion.button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-green-600 mb-4">
                                <FaCheckCircle className="text-2xl" />
                                <p className="font-semibold">Token Generated Successfully!</p>
                            </div>

                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border-2 border-indigo-200">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Your Reset Token:</p>
                                <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
                                    <code className="flex-1 text-sm text-gray-800 break-all">{token}</code>
                                    <button
                                        onClick={copyToClipboard}
                                        className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                                        title="Copy to clipboard"
                                    >
                                        {copied ? <FaCheckCircle /> : <FaCopy />}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                <p className="text-sm text-yellow-800">
                                    <strong>Important:</strong> This token expires in 15 minutes. Copy it and use it to reset your password.
                                </p>
                            </div>

                            <Link
                                to="/reset-password"
                                className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                            >
                                Go to Reset Password
                            </Link>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
