import React, { useState, Dispatch, SetStateAction } from 'react';
import { Search, Plus, Sparkles, Percent, Calendar, Check, AlertTriangle, Trash, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Coupon } from '../types';

interface CouponsProps {
  coupons: Coupon[];
  setCoupons: Dispatch<SetStateAction<Coupon[]>>;
}

export default function Coupons({ coupons, setCoupons }: CouponsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // New Coupon Fields
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percentage' | 'fixed'>('percentage');
  const [newValue, setNewValue] = useState(15);
  const [newMinSpend, setNewMinSpend] = useState(150);
  const [newExpiry, setNewExpiry] = useState('');
  const [newLimit, setNewLimit] = useState(100);

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newExpiry) return;

    const newCoupon: Coupon = {
      id: `CP-0${coupons.length + 1}`,
      code: newCode.toUpperCase().replace(/\s+/g, ''),
      discountType: newType,
      discountValue: Number(newValue),
      minSpend: Number(newMinSpend),
      expiryDate: newExpiry,
      status: 'Active',
      usageLimit: Number(newLimit),
      usageCount: 0,
    };

    setCoupons([newCoupon, ...coupons]);

    // Reset Form
    setNewCode('');
    setNewType('percentage');
    setNewValue(15);
    setNewMinSpend(150);
    setNewExpiry('');
    setNewLimit(100);
    setShowAddForm(false);
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'Active' ? 'Expired' : 'Active';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const deleteCoupon = (id: string) => {
    if (confirm('Are you certain you want to permanently clear this promotion?')) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Filter based on search term
  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="coupons_atelier_page" className="space-y-6 font-sans pb-12 selection:bg-amber-800 selection:text-white relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light text-white tracking-wide">
            Exclusive <span className="italic font-medium text-amber-250">Coupons</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Publish bespoke promotional rates, secure min spend qualifications, and monitor customer utilization analytics.
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (!newExpiry) {
              // Default expiry 3 months from now
              const d = new Date();
              d.setMonth(d.getMonth() + 3);
              setNewExpiry(d.toISOString().split('T')[0]);
            }
          }}
          className="bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-black text-xs font-semibold uppercase tracking-wider py-3 px-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg self-start md:self-auto border border-amber-400/20"
        >
          {showAddForm ? <X className="w-4 h-4 text-black" /> : <Plus className="w-4 h-4 text-black" />}
          {showAddForm ? 'Close Dispatcher' : 'Formulate New Coupon'}
        </button>
      </div>

      {/* Formular Setup */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl relative">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
              <div className="flex items-center gap-2 mb-4 text-amber-200 font-serif text-base font-normal">
                <Sparkles className="w-4 h-4 text-amber-405 animate-pulse" />
                Configure Bespoke Promotion Rate
              </div>

              <form onSubmit={handleAddCouponSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Code name */}
                <div>
                  <label className="block text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-medium">Coupon Promo Code</label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:bg-[#121212]/40 text-xs py-2.5 px-3.5 rounded-xl focus:outline-none transition-all placeholder-slate-500 font-mono font-semibold text-white"
                    placeholder="E.g., GOLDENFALL20"
                  />
                </div>

                {/* Discount type */}
                <div>
                  <label className="block text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-medium">Adjustment Model</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => { setNewType('percentage'); setNewValue(15); }}
                      className={`text-xs py-2.5 px-3 rounded-lg border font-semibold font-sans transition-all cursor-pointer ${
                        newType === 'percentage'
                          ? 'bg-amber-500/20 text-amber-200 border-amber-400/40 font-bold'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      Percentage (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setNewType('fixed'); setNewValue(50); }}
                      className={`text-xs py-2.5 px-3 rounded-lg border font-semibold font-sans transition-all cursor-pointer ${
                        newType === 'fixed'
                          ? 'bg-amber-500/20 text-amber-200 border-amber-400/40 font-bold'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      Bespoke Amount ($)
                    </button>
                  </div>
                </div>

                {/* Discount value */}
                <div>
                  <label className="block text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-medium">
                    {newType === 'percentage' ? 'Percentage Rate (%)' : 'Deducted Value ($)'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={newType === 'percentage' ? 100 : 1000}
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:bg-[#121212]/40 text-xs py-2.5 px-3.5 rounded-xl focus:outline-none transition-all text-white"
                  />
                </div>

                {/* Minimum Spending */}
                <div>
                  <label className="block text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-medium">Bespoke Min spend value ($)</label>
                  <input
                    type="number"
                    required
                    value={newMinSpend}
                    onChange={(e) => setNewMinSpend(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:bg-[#121212]/40 text-xs py-2.5 px-3.5 rounded-xl focus:outline-none transition-all text-white"
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-medium">Valid Until Day</label>
                  <input
                    type="date"
                    required
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:bg-[#121212]/40 text-xs py-2.5 px-3.5 rounded-xl focus:outline-none transition-all text-white"
                  />
                </div>

                {/* Usage Limits */}
                <div>
                  <label className="block text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-medium">Permissible Redemption Limit</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newLimit}
                    onChange={(e) => setNewLimit(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:bg-[#121212]/40 text-xs py-2.5 px-3.5 rounded-xl focus:outline-none transition-all text-white"
                  />
                </div>

                <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 border border-amber-500/20 text-black font-semibold rounded-lg text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Publish Promo
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between backdrop-blur-md">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold font-sans">Total active promos</p>
            <h3 className="font-serif text-2xl font-semibold text-white mt-1 font-mono">
              {coupons.filter(c => c.status === 'Active').length} <span className="text-slate-500 font-sans font-normal">/ {coupons.length}</span>
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Percent className="w-4.5 h-4.5 text-amber-200" />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between backdrop-blur-md">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold font-sans">Gross Redemptions</p>
            <h3 className="font-serif text-2xl font-semibold text-white mt-1 font-mono">
              {coupons.reduce((sum, cp) => sum + cp.usageCount, 0)} <span className="text-slate-500 font-sans font-normal">uses</span>
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Check className="w-4.5 h-4.5 text-slate-200" />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between backdrop-blur-md">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold font-sans">Most active promo</p>
            <h3 className="font-serif text-lg font-bold text-amber-200 tracking-wider mt-2 font-mono">
              AURALUXE15
            </h3>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-amber-200" />
          </div>
        </div>
      </div>

      {/* search input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 focus:border-amber-400/50 text-xs py-3 pl-10 pr-4 rounded-xl focus:outline-none transition-colors text-white placeholder-slate-500 backdrop-blur-md"
          placeholder="Search promotional codes register..."
        />
      </div>

      {/* Grid of coupons cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" id="coupons_grid">
        {filteredCoupons.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white/5 rounded-2xl border border-white/10 text-slate-400 text-xs backdrop-blur-md">
            No bespoke promotional rules found inside current registy.
          </div>
        ) : (
          filteredCoupons.map((c) => {
            const isRedemptionMaxed = c.usageCount >= c.usageLimit;
            const isExpired = c.status === 'Expired' || isRedemptionMaxed;

            return (
              <motion.div
                key={c.id}
                whileHover={{ y: -3 }}
                className={`border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between transition-all backdrop-blur-md ${
                  isExpired 
                    ? 'border-white/5 opacity-50 bg-white/[0.01]' 
                    : 'border-white/10 bg-white/5 shadow-[0_4px_18px_rgba(255,255,255,0.01)]'
                }`}
              >
                {/* Coupon Header details */}
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-slate-405 text-[10px] font-bold uppercase">{c.id}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <h3 className="font-mono text-xl font-bold tracking-wider text-amber-200">{c.code}</h3>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCouponStatus(c.id)}
                      className={`text-[9px] uppercase tracking-widest font-semibold px-2 py-1 rounded-full border cursor-pointer ${
                        c.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          : 'bg-red-500/10 text-red-300 border-red-500/20'
                      }`}
                    >
                      {c.status}
                    </button>
                  </div>

                  {/* Discount values */}
                  <div className="bg-black/35 border border-white/10 p-4 rounded-xl flex items-center justify-between text-xs text-slate-200">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-sans font-medium">Est. deduction</p>
                      <span className="font-serif text-2xl font-light text-amber-200 mr-1 leading-none inline-block mt-1">
                        {c.discountType === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue}`}
                      </span>
                      <span className="text-slate-400 font-sans text-[10px]">Off tickets</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-sans font-medium">Pre-requisite</p>
                      <span className="font-mono text-xs font-semibold text-slate-300 block mt-2">Spent &gt; ${c.minSpend}</span>
                    </div>
                  </div>

                  {/* Usage tracking meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400 font-sans">Utilization Count</span>
                      <span className="text-slate-200 font-mono font-bold">
                        {c.usageCount} <span className="text-slate-500">/</span> {c.usageLimit}
                      </span>
                    </div>
                    {/* customized progress bar */}
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isExpired ? 'bg-slate-500' : 'bg-amber-500'}`}
                        style={{ width: `${(c.usageCount/c.usageLimit)*100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer bar */}
                <div className="bg-white/5 px-5 py-3 border-t border-white/10 flex items-center justify-between text-xs transition-colors">
                  <span className="inline-flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
                    <Calendar className="w-3.5 h-3.5" />
                    Exp: {c.expiryDate}
                  </span>

                  <button
                    onClick={() => deleteCoupon(c.id)}
                    className="p-1 px-2.5 rounded-lg text-red-400 hover:bg-white/5 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors border border-red-500/10"
                  >
                    <Trash className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold">Crumble</span>
                  </button>
                </div>

              </motion.div>
            );
          })
        )}
      </div>

    </div>
  );
}
