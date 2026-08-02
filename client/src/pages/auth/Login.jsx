import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import useAuthStore from '../../store/useAuthStore';
import useToast from '../../hooks/useToast';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    CheckSquare,
} from 'lucide-react';

// Inline Lottie JSON — a simple task/productivity animation encoded as data URL
// We use a CDN URL via a fetched animationData approach; fallback to a simple SVG placeholder
import loginAnimation from '../../assets/login-animation.json';
import { getApiErrorMessage } from '../../utils/apiError';

const Login = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { Login: login, isLoggingin } = useAuthStore();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(formData);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (err) {
            const msg = getApiErrorMessage(err, 'Login failed. Please try again.');
            toast.error(msg);
            setError(msg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
            <div className="w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-2xl shadow-indigo-900/40">

                {/* Left — Form Panel */}
                <div className="w-full lg:w-1/2 bg-white p-8 sm:p-12 flex flex-col justify-center">
                    {/* Brand */}
                    <div className="flex items-center gap-2 mb-10">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <CheckSquare className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">TodoFlow</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h1>
                        <p className="text-gray-500 text-sm">Welcome back! Enter your details to continue.</p>
                    </div>

                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoggingin}
                            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-200 transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoggingin ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Don&apos;t have an account?{' '}
                        <Link to="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700 transition">
                            Create one
                        </Link>
                    </p>
                </div>

                {/* Right — Lottie Panel */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-violet-700 flex-col items-center justify-center p-12 relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-white/10 rounded-full" />

                    <div className="relative z-10 w-full max-w-sm">
                        <Lottie animationData={loginAnimation} loop autoplay className="w-full drop-shadow-2xl" />
                    </div>

                    <div className="relative z-10 text-center mt-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Organise your day</h2>
                        <p className="text-indigo-200 text-sm leading-relaxed max-w-xs">
                            Keep track of everything that matters. Simple, fast, and beautiful todo management.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
