import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import useAuthStore from '../../store/useAuthStore';
import useToast from '../../hooks/useToast';
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    CheckSquare,
} from 'lucide-react';

import signupAnimation from '../../assets/signup-animation.json';
import { getApiErrorMessage, getFieldErrors } from '../../utils/apiError';

const strengthConfig = {
    weak:   { label: 'Weak',   color: 'bg-red-500',    width: 'w-1/3' },
    medium: { label: 'Fair',   color: 'bg-yellow-500', width: 'w-2/3' },
    strong: { label: 'Strong', color: 'bg-green-500',  width: 'w-full' },
};

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

const getStrength = (val) => {
    if (!val) return '';
    if (val.length < 6 || !passwordRegex.test(val)) return 'weak';
    if (val.length < 10) return 'medium';
    return 'strong';
};

const Signup = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { Register: register, isSigningup } = useAuthStore();
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    const strength = getStrength(formData.password);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(null);
        if (fieldErrors[name]) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        try {
            await register(formData);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (err) {
            const msg = getApiErrorMessage(err, 'Registration failed. Please try again.');
            const fields = getFieldErrors(err);
            toast.error(msg);
            setError(msg);
            setFieldErrors(fields);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
            <div className="w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-2xl shadow-indigo-900/40">

                {/* Left — Form Panel */}
                <div className="w-full lg:w-1/2 bg-white p-8 sm:p-12 flex flex-col justify-center">
                    {/* Brand */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <CheckSquare className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">TodoFlow</span>
                    </div>

                    <div className="mb-7">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create account</h1>
                        <p className="text-gray-500 text-sm">Start organising your life — it&apos;s free.</p>
                    </div>

                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="John"
                                        required
                                        className={`w-full pl-10 pr-3 py-3 rounded-xl border bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                                            fieldErrors.firstName ? 'border-red-300' : 'border-gray-200'
                                        }`}
                                    />
                                </div>
                                {fieldErrors.firstName && (
                                    <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Doe"
                                        required
                                        className={`w-full pl-10 pr-3 py-3 rounded-xl border bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                                            fieldErrors.lastName ? 'border-red-300' : 'border-gray-200'
                                        }`}
                                    />
                                </div>
                                {fieldErrors.lastName && (
                                    <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                                        fieldErrors.email ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                />
                            </div>
                            {fieldErrors.email && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Aa1@bc (min. 6 chars)"
                                    required
                                    className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                                        fieldErrors.password ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {fieldErrors.password ? (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                            ) : (
                                <p className="mt-1 text-xs text-gray-400">
                                    Use uppercase, lowercase, number, and special character (@$!%*?&)
                                </p>
                            )}
                            {strength && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-300 ${strengthConfig[strength].color} ${strengthConfig[strength].width}`} />
                                    </div>
                                    <span className={`text-xs font-medium ${
                                        strength === 'weak' ? 'text-red-600' :
                                        strength === 'medium' ? 'text-yellow-600' : 'text-green-600'
                                    }`}>
                                        {strengthConfig[strength].label}
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSigningup}
                            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-200 transition disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                        >
                            {isSigningup ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating account…
                                </>
                            ) : (
                                <>
                                    Create account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Right — Lottie Panel */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 to-indigo-700 flex-col items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-white/10 rounded-full" />

                    <div className="relative z-10 w-full max-w-sm">
                        <Lottie animationData={signupAnimation} loop autoplay className="w-full drop-shadow-2xl" />
                    </div>

                    <div className="relative z-10 text-center mt-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Get things done</h2>
                        <p className="text-indigo-200 text-sm leading-relaxed max-w-xs">
                            Plan your tasks, track your progress, and achieve your goals — one todo at a time.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
