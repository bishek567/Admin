import { Sparkles, Calendar, Users, Percent, Star, BarChart3, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { AdminUser } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  admin: AdminUser | null;
  onLogout: () => void;
}

export default function Sidebar({ currentTab, setCurrentTab, admin, onLogout }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'analytics', label: 'Analytics Insights', icon: BarChart3 },
    { id: 'bookings', label: 'Booking Atelier', icon: Calendar },
    { id: 'users', label: 'Client Register', icon: Users },
    { id: 'coupons', label: 'Exclusive Coupons', icon: Percent },
    { id: 'reviews', label: 'Customer Reviews', icon: Star },
  ];

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden h-16 bg-[#0c0c0c]/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 fixed top-0 inset-x-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <span className="font-serif text-lg tracking-wider text-amber-200 font-medium">AURA LUXE</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-400 hover:text-amber-300 focus:outline-none focus:text-amber-300 cursor-pointer"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar background drawer for mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Primary Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 lg:z-30 w-72 bg-white/5 border-r border-white/10 backdrop-blur-2xl p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:min-h-screen pt-20 lg:pt-6`}
      >
        <div className="space-y-8">
          {/* Brand Identity Header */}
          <div className="hidden lg:flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h1 className="font-serif text-xl tracking-wider text-amber-200 font-semibold uppercase">AURA LUXE</h1>
              <p className="font-sans text-[9px] text-amber-500/60 uppercase tracking-[0.25em] leading-none mt-1">Beauty Studio Admin</p>
            </div>
          </div>

          <div className="border-b border-white/10 pb-6 hidden lg:block" />

          {/* Navigation Links */}
          <nav className="space-y-1.5" id="sidebar_nav">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold px-2 mb-2">Management</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-left text-xs tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white/10 text-amber-200 border border-white/10 shadow-[0_0_12px_rgba(255,255,255,0.05)]'
                      : 'text-slate-400 hover:text-amber-200 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span className="font-sans font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin context footer */}
        <div className="space-y-4 border-t border-white/10 pt-6">
          {admin && (
            <div className="flex items-center gap-3 px-2">
              <img
                src={admin.avatar}
                alt={admin.name}
                className="w-10 h-10 rounded-full object-cover border border-white/20"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-200 truncate font-sans">{admin.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[9px] text-slate-400 tracking-wider font-mono font-medium uppercase">{admin.role}</span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-400 hover:text-red-400 hover:bg-red-950/20 hover:border-red-900/30 transition-all duration-200 cursor-pointer"
          >
            <span className="font-sans font-medium tracking-wide">Sign Out</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
