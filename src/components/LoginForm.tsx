import { useState } from 'react';
import { X, Mail, Lock, LogIn } from 'lucide-react';

interface LoginFormProps {
  onClose: () => void;
  onLogin: (email: string) => void;
}

export function LoginForm({ onClose, onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email aur password required hai');
      return;
    }
    onLogin(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-[#D9DCD2]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D9DCD2]">
          <h2 className="text-lg font-bold text-[#1A211E] font-serif-heading">Login to GiveNear</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#F3F4EE] rounded-lg transition-colors">
            <X className="w-5 h-5 text-[#58655E]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#58655E] uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#828F87]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAF7] border border-[#D9DCD2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3D]/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#1F4D3D] text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-[#16352A] transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>

          <p className="text-center text-xs text-[#828F87]">
            New here? <button type="button" className="text-[#1F4D3D] font-semibold hover:underline">Register as NGO</button>
          </p>
        </form>
      </div>
    </div>
  );
}
