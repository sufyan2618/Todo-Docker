import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useToast from '../../hooks/useToast';
import { getApiErrorMessage, getFieldErrors } from '../../utils/apiError';
import AuthLayout from '../../components/AuthLayout';

export default function Signup() {
  const navigate = useNavigate();
  const toast = useToast();
  const { Register: register, isSigningup } = useAuthStore();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const change = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(null); setFieldErrors({ ...fieldErrors, [e.target.name]: undefined }); };
  const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(formData.password);
  const strength = !validPassword ? 'weak' : formData.password.length < 10 ? 'fair' : 'strong';
  const submit = async (e) => {
    e.preventDefault(); setError(null); setFieldErrors({});
    try { await register(formData); toast.success('Account created successfully!'); navigate('/dashboard'); }
    catch (err) { const message = getApiErrorMessage(err, 'Registration failed. Please try again.'); setError(message); setFieldErrors(getFieldErrors(err)); toast.error(message); }
  };
  const field = (name, label, placeholder, autoComplete, type = 'text') => <div className="form-field"><label htmlFor={name}>{label}</label><input id={name} name={name} type={type} autoComplete={autoComplete} value={formData[name]} onChange={change} placeholder={placeholder} required aria-invalid={!!fieldErrors[name]} aria-describedby={fieldErrors[name] ? `${name}-error` : undefined} />{fieldErrors[name] && <small className="field-error" id={`${name}-error`}>{fieldErrors[name]}</small>}</div>;
  return <AuthLayout><div className="auth-form-content signup-content">
    <span className="eyebrow orange-text">HERE’S TO A FRESH START</span><h2>Find your flow.</h2><p className="auth-description">A little space for everything you want to do.</p>
    {error && <div className="form-error" role="alert">{error}</div>}
    <form onSubmit={submit} className="auth-form signup-form">
      <div className="name-fields">{field('firstName', 'First name', 'Alex', 'given-name')}{field('lastName', 'Last name', 'Morgan', 'family-name')}</div>
      {field('email', 'Email address', 'you@example.com', 'email', 'email')}
      <div className="form-field"><label htmlFor="password">Password</label><div className="password-field"><input id="password" type={showPassword ? 'text' : 'password'} name="password" autoComplete="new-password" value={formData.password} onChange={change} placeholder="Create a password" minLength={6} required aria-invalid={!!fieldErrors.password} aria-describedby="password-help" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
      <small id="password-help" className={fieldErrors.password ? 'field-error' : 'field-help'}>{fieldErrors.password || '6+ characters with uppercase, lowercase, a number and a symbol (@$!%*?&).'}</small>
      {formData.password && <div className={`password-strength ${strength}`}><span /><small>{strength.charAt(0).toUpperCase() + strength.slice(1)}</small></div>}</div>
      <button className="primary-button auth-submit" disabled={isSigningup}>{isSigningup ? <><Loader2 className="spin" size={18} /> Creating account…</> : <>Create your space <ArrowRight size={19} /></>}</button>
    </form><p className="auth-switch">Already part of the flow? <Link to="/login">Sign in ↗</Link></p>
  </div></AuthLayout>;
}
