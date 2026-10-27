import { useState, type FormEvent } from 'react';
import { X, Mail, Lock, LogIn, UserPlus, Eye, EyeOff, HeartHandshake, Building2, UserRound, Phone, ShieldCheck } from 'lucide-react';
import type { UserRole, UserSession } from '../types';
import { getAccountByEmail, isValidEmail, isValidPassword, isValidPhone, login, register } from '../services/auth';

interface LoginFormProps {
  onClose: () => void;
  onLogin: (session: UserSession) => void;
  defaultRole?: UserRole;
}

export function LoginForm({ onClose, onLogin, defaultRole = 'donor' }: LoginFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [representative, setRepresentative] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const account = getAccountByEmail(value);
    if (account) {
      setName(account.name);
      setPhone(account.phone);
      setRegNumber(account.regNumber ?? '');
      setRepresentative(account.representative ?? '');
    }
  };

  const handleSwitchMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setError('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (!email.trim() || !password) {
        setError('Email and password are required.');
        return;
      }
      if (!isValidEmail(email)) {
        setError('Please enter a valid email address.');
        return;
      }
      if (!isValidPassword(password)) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      setIsSubmitting(true);
      try {
        const session = login({ email, password, role });
        onLogin(session);
      } catch (err: any) {
        setError(err?.message || 'Login failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Register mode
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!isValidPassword(password)) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!isValidPhone(phone)) {
      setError('Please enter a valid phone / WhatsApp number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const session = register({ email, password, name, phone, role, regNumber, representative });
      onLogin(session);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = (demoEmail: string, demoPassword: string) => {
    setMode('login');
    setRole(demoEmail.startsWith('ngo') ? 'ngo' : 'donor');
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const isDonor = role === 'donor';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-[#D9DCD2] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D9DCD2] sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-lg font-bold text-[#1A211E] font-serif-heading">Login to GiveNear</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#F3F4EE] rounded-lg transition-colors">
            <X className="w-5 h-5 text-[#58655E]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Mode Toggle */}
          <div className="grid grid-cols-2 bg-[#F3F4EE] rounded-xl p-1 border border-[#D9DCD2]">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'login' ? 'bg-[#1F4D3D] text-white shadow-sm' : 'text-[#58655E] hover:text-[#1A211E]'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <LogIn className="w-3.5 h-3.5" /> Login
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('register')}
              className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'register' ? 'bg-[#1F4D3D] text-white shadow-sm' : 'text-[#58655E] hover:text-[#1A211E]'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5" /> {mode === 'register' ? 'Register' : 'New User? Register'}
              </span>
            </button>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setRole('donor'); setError(''); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                isDonor
                  ? 'bg-[#1F4D3D] text-white border-[#1F4D3D]'
                  : 'bg-[#F3F4EE] text-[#58655E] border-[#D9DCD2] hover:bg-[#EBF2EE]'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              Donor
            </button>
            <button
              type="button"
              onClick={() => { setRole('ngo'); setError(''); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                !isDonor
                  ? 'bg-[#1F4D3D] text-white border-[#1F4D3D]'
                  : 'bg-[#F3F4EE] text-[#58655E] border-[#D9DCD2] hover:bg-[#EBF2EE]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              NGO
            </button>
          </div>
          <p className="text-[11px] text-[#828F87] -mt-2 text-center">
            {mode === 'login'
              ? `Login as a ${isDonor ? 'Donor' : 'NGO'} to access verified features.` +
                (isDonor ? ' Donors can post donation listings for doorstep pickup.' : ' NGOs can claim listings and publish verified needs.')
              : `Register as a ${isDonor ? 'Donor' : 'NGO'}. ${isDonor ? 'Donors post surplus items for direct pickup.' : 'NGOs publish verified requirements for volunteers.'}`}
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#58655E] uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#828F87]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAF7] border border-[#D9DCD2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]/20"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#58655E] uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#828F87]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#F9FAF7] border border-[#D9DCD2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]/20"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#828F87] hover:text-[#1A211E] transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#1F4D3D] text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-[#16352A] transition-colors disabled:opacity-50 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                {isSubmitting ? 'Logging in...' : `Login as ${isDonor ? 'Donor' : 'NGO'}`}
              </button>

              {isDonor && (
                <div className="bg-[#F3F4EE] border border-[#D9DCD2] rounded-xl p-3 text-[11px] text-[#58655E] space-y-1">
                  <div className="font-bold text-[#1A211E] flex items-center gap-1.5">
                    <UserRound className="w-3.5 h-3.5 text-[#1F4D3D]" /> Donor Demo Account
                  </div>
                  Email: <strong>donor@givenear.org</strong> • Password: <strong>donor123</strong>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('donor@givenear.org', 'donor123')}
                    className="text-[#1F4D3D] font-semibold hover:underline cursor-pointer"
                  >
                    Autofill
                  </button>
                </div>
              )}

              {!isDonor && (
                <div className="bg-[#F3F4EE] border border-[#D9DCD2] rounded-xl p-3 text-[11px] text-[#58655E] space-y-1">
                  <div className="font-bold text-[#1A211E] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1F4D3D]" /> NGO Demo Account
                  </div>
                  Email: <strong>ngo@givenear.org</strong> • Password: <strong>ngo123</strong>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('ngo@givenear.org', 'ngo123')}
                    className="text-[#1F4D3D] font-semibold hover:underline cursor-pointer"
                  >
                    Autofill
                  </button>
                </div>
              )}

              <p className="text-center text-xs text-[#828F87]">
                New here?{' '}
                <button type="button" onClick={() => handleSwitchMode('register')} className="text-[#1F4D3D] font-semibold hover:underline cursor-pointer">
                  Register as {isDonor ? 'Donor' : 'NGO'}
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#58655E] uppercase tracking-wider">
                  {isDonor ? 'Donor / Individual Name *' : 'NGO / Organization Name *'}
                </label>
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#828F87]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAF7] border border-[#D9DCD2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]/20"
                    placeholder={isDonor ? 'e.g. Ramesh K.' : 'e.g. Robin Hood Army'}
                  />
                </div>
              </div>

              {!isDonor && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#58655E] uppercase tracking-wider">Registration / Darpan ID</label>
                    <input
                      type="text"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F9FAF7] border border-[#D9DCD2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]/20"
                      placeholder="e.g. REG-DEL-2019-8812"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#58655E] uppercase tracking-wider">Field Coordinator</label>
                    <input
                      type="text"
                      value={representative}
                      onChange={(e) => setRepresentative(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F9FAF7] border border-[#D9DCD2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]/20"
                      placeholder="e.g. Sunita Sharma"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#58655E] uppercase tracking-wider">Phone / WhatsApp *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#828F87]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAF7] border border-[#D9DCD2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]/20"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#58655E] uppercase tracking-wider">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#828F87]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAF7] border border-[#D9DCD2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]/20"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#58655E] uppercase tracking-wider">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#828F87]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-[#F9FAF7] border border-[#D9DCD2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]/20"
                      placeholder="Minimum 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#828F87] hover:text-[#1A211E] transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#58655E] uppercase tracking-wider">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#828F87]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAF7] border border-[#D9DCD2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]/20"
                      placeholder="Repeat password"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#1F4D3D] text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-[#16352A] transition-colors disabled:opacity-50 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                {isSubmitting ? 'Creating account...' : `Register as ${isDonor ? 'Donor' : 'NGO'}`}
              </button>

              <p className="text-center text-xs text-[#828F87]">
                Already have an account?{' '}
                <button type="button" onClick={() => handleSwitchMode('login')} className="text-[#1F4D3D] font-semibold hover:underline cursor-pointer">
                  Login here
                </button>
              </p>
            </div>
          )}

          <p className="text-center text-[11px] text-[#828F87] border-t border-[#D9DCD2] pt-4">
            By continuing you agree to GiveNear's Verified Pickup Privacy Policy. Donor &amp; NGO contact details are used only to coordinate doorstep pickup.
          </p>
        </form>
      </div>
    </div>
  );
}
