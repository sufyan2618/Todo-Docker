import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useToast from '../../hooks/useToast';
import { getApiErrorMessage } from '../../utils/apiError';
import AuthLayout from '../../components/AuthLayout';

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const { Login: login, isLoggingin } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const change = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(null); };
  const submit = async (e) => {
    e.preventDefault(); setError(null);
    try { await login(formData); toast.success('Welcome back!'); navigate('/dashboard'); }
    catch (err) { const message = getApiErrorMessage(err, 'Login failed. Please try again.'); setError(message); toast.error(message); }
  };
  return <AuthLayout><div className="auth-form-content">
    <span className="eyebrow orange-text">PICK UP WHERE YOU LEFT OFF</span><h2>Welcome back.</h2><p className="auth-description">Your plans, projects, and little wins are waiting.</p>
    {error && <div className="form-error" role="alert">{error}</div>}
    <form onSubmit={submit} className="auth-form">
      <label htmlFor="email">Email address</label><input id="email" type="email" name="email" autoComplete="email" value={formData.email} onChange={change} placeholder="you@example.com" required />
      <label htmlFor="password">Password</label><div className="password-field"><input id="password" type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password" value={formData.password} onChange={change} placeholder="Enter your password" required /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
      <button className="primary-button auth-submit" disabled={isLoggingin}>{isLoggingin ? <><Loader2 className="spin" size={18} /> Signing in…</> : <>Let’s get into it <ArrowRight size={19} /></>}</button>
    </form><p className="auth-switch">New around here? <Link to="/signup">Create an account <ArrowUpRightIcon /></Link></p>
  </div></AuthLayout>;
}
function ArrowUpRightIcon() { return <span aria-hidden="true">↗</span>; }
