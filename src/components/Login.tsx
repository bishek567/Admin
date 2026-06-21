import React, { useState } from 'react';
import { Sparkles, Eye, EyeOff, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { AdminUser } from '../types';

interface LoginProps {
  onLoginSuccess: (user: AdminUser) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('admin@auraluxe.com');
  const [password, setPassword] = useState('luxe2026');
  const [role, setRole] = useState<'Super Admin' | 'Manager' | 'Receptionist'>('Super Admin');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simulate luxury authentication delay
    setTimeout(() => {
      if (email === 'admin@auraluxe.com' && password === 'luxe2026') {
        const uName = role === 'Super Admin' ? 'Genevieve Laurent' : role === 'Manager' ? 'Marcus Thorne' : 'Saffron Bell';
        onLoginSuccess({
          id: role === 'Super Admin' ? 'ADM-001' : role === 'Manager' ? 'MGR-002' : 'REC-003',
          email,
          name: uName,
          role,
          avatar: role === 'Super Admin' 
            ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
          lastLogin: new Date().toLocaleString()
        });
      } else {
        setError('The key or credentials provided are invalid in our register.');
        setIsSubmitting(false);
      }
    }, 1200);
  };

  const fillCredentials = (selectedRole: 'Super Admin' | 'Manager' | 'Receptionist') => {
    setEmail('admin@auraluxe.com');
    setPassword('luxe2026');
    setRole(selectedRole);
  };

  return (
    <div id="login_container" className="min-h-screen bg-[#070707] flex items-center justify-center relative overflow-hidden px-4 font-sans text-stone-200 selection:bg-amber-800 selection:text-white">
      {/* Absolute Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] rounded-full bg-gradient-to-tr from-amber-500/10 to-purple-600/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-gradient-to-bl from-teal-500/10 via-rose-500/5 to-amber-500/5 blur-[130px] pointer-events-none" />

      {/* Grid Overlay for luxury feel */}
      <div className="absolute inset-0 bg-[#070707] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_100%)] opacity-80 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg z-10"
      >
        {/* Logo and Headings */}
        <div id="login_header" className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-md">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-amber-100 tracking-wider mb-2 font-light">
            Aura Luxe
          </h1>
          <p className="text-slate-400 font-sans tracking-widest text-xs uppercase">
            Beauty Studio &bull; Admin Console
          </p>
        </div>

        {/* Card Panel */}
        <div id="login_card" className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-2xl relative">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          
          <h2 className="font-serif text-xl text-stone-200 tracking-wide text-center mb-6 font-normal">
            Sign In to the Atelier
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label id="role_label" className="block text-slate-400 text-xs tracking-wider uppercase mb-2">
                Administrator Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Super Admin', 'Manager', 'Receptionist'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => fillCredentials(r)}
                    className={`py-2 px-1 text-xs font-semibold rounded-lg border transition-all duration-300 cursor-pointer ${
                      role === r
                        ? 'bg-amber-500/20 text-amber-250 border-amber-400/40 backdrop-blur-md shadow-lg shadow-amber-500/5'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:border-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Address */}
            <div id="email_field_group">
              <label className="block text-slate-400 text-xs tracking-wider uppercase mb-2" htmlFor="email_input">
                Atelier Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email_input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:bg-[#121212]/40 transition-all text-white placeholder-slate-500 py-3 pl-10 pr-4 rounded-xl text-sm focus:outline-none"
                  placeholder="name@auraluxe.com"
                />
              </div>
            </div>

            {/* Password */}
            <div id="password_field_group">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-slate-400 text-xs tracking-wider uppercase" htmlFor="password_input">
                  Security Passkey
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password_input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:bg-[#121212]/40 transition-all text-white placeholder-slate-500 py-3 pl-10 pr-10 rounded-xl text-sm focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-amber-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-405 text-xs text-center border border-red-500/20 bg-red-500/5 py-2 px-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            {/* Auto Login Helper Indicator */}
            <div className="bg-[#121212]/60 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong className="text-amber-300">Demo Mode Enabled:</strong> The default secure passkey is pre-filled. Customize credentials or press Sign In below.
              </p>
            </div>

            {/* Login Button */}
            <button
              id="login_submit_btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-black font-semibold py-3 px-4 rounded-xl text-xs uppercase tracking-widest font-sans transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 border border-amber-400/20"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  Enter Executive Suite
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-500 text-xs mt-8 font-sans">
          Secured with SSL 256-bit suite encoding. Aura Luxe Beauty Studio &bull; &copy; 2026 Admin Panel
        </p>
      </motion.div>
    </div>
  );
}
