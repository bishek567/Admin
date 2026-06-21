import React, { useState, Dispatch, SetStateAction } from 'react';
import { Search, Sparkles, Star, ThumbsUp, Trash2, Check, ShieldAlert, BadgeInfo, Smile, Frown, Meh } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Review } from '../types';

interface ReviewsProps {
  reviews: Review[];
  setReviews: Dispatch<SetStateAction<Review[]>>;
}

export default function Reviews({ reviews, setReviews }: ReviewsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [ratingFilter, setRatingFilter] = useState<number | 'All'>('All');

  // Derive ratings metrics on the fly!
  const totalRating = reviews
    .filter(r => r.status === 'Approved')
    .reduce((val, curr) => val + curr.rating, 0);
  const totalApprovedCount = reviews.filter(r => r.status === 'Approved').length;
  const averageRating = totalApprovedCount > 0 ? (totalRating / totalApprovedCount).toFixed(2) : '5.00';

  // Sentiment totals
  const totalActiveReviews = reviews.filter(r => r.status !== 'Deleted');
  const positiveSentimentCount = totalActiveReviews.filter(r => r.sentiment === 'positive').length;
  const neutralSentimentCount = totalActiveReviews.filter(r => r.sentiment === 'neutral').length;
  const negativeSentimentCount = totalActiveReviews.filter(r => r.sentiment === 'negative').length;

  const handleApprove = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
  };

  const handleDelete = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Deleted' } : r))
    );
  };

  const handleRestore = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Pending Approval' } : r))
    );
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.reviewerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesRating = ratingFilter === 'All' || r.rating === Number(ratingFilter);

    return matchesSearch && matchesStatus && matchesRating;
  });

  return (
    <div id="reviews_management_page" className="space-y-6 font-sans pb-12 selection:bg-amber-800 selection:text-white relative z-10">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-light text-white tracking-wide">
          Customer <span className="italic font-medium text-amber-250">Reviews</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Monitor guest testimonials, publish outstanding praises to the main showroom, and analyze sentiment.
        </p>
      </div>

      {/* Sentiment Analysis Metrics Card Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Satisficary score */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between backdrop-blur-md shadow-lg text-white">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Average Testimonial Score</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-serif text-4xl font-light text-white font-mono">{averageRating}</span>
              <span className="text-slate-400 text-xs font-sans">/ 5.00 stars</span>
            </div>
            {/* Stars rendering */}
            <div className="flex gap-1 mt-2 text-amber-500">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} className={`w-3.5 h-3.5 ${idx < Math.round(Number(averageRating)) ? 'fill-amber-500 text-amber-500' : 'text-white/10'}`} />
              ))}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center">
            <ThumbsUp className="w-5 h-5 text-amber-200" />
            <span className="text-[8px] text-amber-300 font-bold tracking-widest uppercase mt-0.5 font-mono">{totalApprovedCount} Live</span>
          </div>
        </div>

        {/* Sentiment breakdown analyzer */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 lg:col-span-2 flex flex-col justify-between backdrop-blur-md shadow-lg text-white">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-4">Live Sentiment Analytics</p>
            
            <div className="space-y-3.5 text-xs text-slate-205 font-sans">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Smile className="w-4 h-4 text-emerald-300 shrink-0" /> Positive praises</span>
                <span className="font-mono font-bold text-slate-100">{positiveSentimentCount} reviews ({(positiveSentimentCount/Math.max(1, totalActiveReviews.length)*100).toFixed(0)}%)</span>
              </div>
              
              {/* stacked progress percentages */}
              <div className="h-2 w-full rounded-full bg-white/10 flex overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full transition-all" 
                  style={{ width: `${(positiveSentimentCount/Math.max(1, totalActiveReviews.length))*100}%` }}
                />
                <div 
                  className="bg-amber-400 h-full transition-all" 
                  style={{ width: `${(neutralSentimentCount/Math.max(1, totalActiveReviews.length))*100}%` }}
                />
                <div 
                  className="bg-red-400 h-full transition-all" 
                  style={{ width: `${(negativeSentimentCount/Math.max(1, totalActiveReviews.length))*100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-3 border-t border-white/10 mt-3 font-sans">
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Positive</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Neutral</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Negative</span>
          </div>
        </div>
      </div>

      {/* Filters area */}
      <div id="reviews_filter_belt" className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
        <div className="sm:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-405">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-amber-400/50 text-xs py-2.5 pl-10 pr-4 rounded-lg focus:outline-none transition-colors text-white placeholder-slate-500"
            placeholder="Search review comment, client name, service..."
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-amber-400/50 text-xs py-2.5 px-3.5 rounded-lg focus:outline-none transition-colors text-slate-200 font-sans cursor-pointer [&>option]:bg-neutral-900"
          >
            <option value="All">All statuses</option>
            <option value="Approved">Approved / Live</option>
            <option value="Pending Approval">Pending Check</option>
            <option value="Deleted">Withdrawn / Deleted</option>
          </select>
        </div>

        <div>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value === 'All' ? 'All' : Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 focus:border-amber-400/50 text-xs py-2.5 px-3.5 rounded-lg focus:outline-none transition-colors text-slate-200 font-sans cursor-pointer [&>option]:bg-neutral-900"
          >
            <option value="All">All star-counts</option>
            <option value="5">★★★★★ Only</option>
            <option value="4">★★★★ Only</option>
            <option value="3">★★★ Only</option>
            <option value="2">★★ Only</option>
            <option value="1">★ Only</option>
          </select>
        </div>
      </div>

      {/* Reviews Cards List Grid */}
      <div className="space-y-4" id="reviews_cards_panel">
        {filteredReviews.length === 0 ? (
          <div className="py-12 text-center bg-white/5 rounded-2xl border border-white/10 text-slate-400 text-xs font-sans backdrop-blur-md">
            No visitor comments match specified filter conditions.
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const isApproved = rev.status === 'Approved';
            const isDeleted = rev.status === 'Deleted';
            
            return (
              <motion.div
                key={rev.id}
                layout
                className={`rounded-2xl border p-5 md:p-6 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 backdrop-blur-md ${
                  isDeleted 
                    ? 'border-white/5 bg-white/[0.01] opacity-50' 
                    : !isApproved 
                    ? 'border-amber-500/20 bg-amber-500/5 shadow-[0_4px_18px_rgba(217,119,6,0.01)]' 
                    : 'border-white/10 bg-white/5 hover:border-amber-500/20 shadow-sm'
                }`}
              >
                {/* Sentiment side bar decorator */}
                <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                  rev.sentiment === 'positive' 
                    ? 'bg-emerald-555' 
                    : rev.sentiment === 'neutral' 
                    ? 'bg-amber-400' 
                    : 'bg-red-400'
                }`} />

                {/* Left block Info content */}
                <div className="space-y-2.5 md:max-w-2xl font-sans">
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5 md:pt-0">
                    <span className="font-semibold text-white text-xs">{rev.reviewerName}</span>
                    <span className="text-white/20 text-xs">&bull;</span>
                    <span className="text-slate-400 text-[10px] uppercase tracking-wider font-mono">{rev.date}</span>
                    <span className="text-white/20 text-xs">&bull;</span>
                    <span className="text-amber-200 font-semibold font-mono text-[10px] uppercase bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                      {rev.serviceName}
                    </span>
                  </div>

                  {/* Stars list */}
                  <div className="flex gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className={`w-3.5 h-3.5 ${idx < rev.rating ? 'fill-amber-505 text-amber-500' : 'text-white/10'}`} />
                    ))}
                  </div>

                  <p className="text-slate-200 text-xs leading-relaxed italic">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-sans">
                    <span className="font-semibold">Sentiment Registered:</span>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono uppercase font-bold text-[9px] border ${
                      rev.sentiment === 'positive' 
                        ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' 
                        : rev.sentiment === 'neutral'
                        ? 'text-amber-205 bg-amber-500/10 border-amber-500/20'
                        : 'text-red-300 bg-red-500/10 border-red-500/20'
                    }`}>
                      {rev.sentiment === 'positive' ? 'POSITIVE' : rev.sentiment === 'neutral' ? 'NEUTRAL' : 'NEGATIVE'}
                    </span>
                  </div>
                </div>

                {/* Administrative approval button actions */}
                <div className="flex gap-2 shrink-0 self-end md:self-center font-sans">
                  {isDeleted ? (
                    <button
                      onClick={() => handleRestore(rev.id)}
                      className="px-3 py-1.5 text-[10px] font-bold text-slate-300 hover:text-white bg-white/5 border border-white/10 rounded-lg cursor-pointer transition-colors"
                    >
                      Audit Back-in
                    </button>
                  ) : (
                    <>
                      {!isApproved && (
                        <button
                          onClick={() => handleApprove(rev.id)}
                          className="px-3 py-1.5 text-[10px] font-bold text-black hover:bg-emerald-400 bg-emerald-500 border border-emerald-400/20 rounded-lg cursor-pointer transition-all duration-300 flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-black" />
                          Approve Testimonial
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="px-3 py-1.5 text-[10px] font-bold text-slate-300 bg-white/5 border border-white/10 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/20 rounded-lg cursor-pointer transition-all duration-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                        Withdraw / Purge
                      </button>
                    </>
                  )}
                </div>

              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
