import { useState } from 'react';
import { DollarSign, CalendarCheck, TrendingUp, UsersRound, Sparkles, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { Booking, ClientUser, Coupon, Review, StudioAnalytics } from '../types';

interface AnalyticsProps {
  analytics: StudioAnalytics;
  clients: ClientUser[];
  bookings: Booking[];
  reviews: Review[];
  coupons: Coupon[];
}

export default function Analytics({ analytics, clients, bookings, reviews, coupons }: AnalyticsProps) {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(null);

  // Derive dynamic analytics stats to reflect changes in bookings or reviews
  const currentTotalRevenue = bookings
    .filter(b => b.status === 'Completed' || b.status === 'Confirmed')
    .reduce((val, curr) => val + curr.price, 0) + (analytics.totalRevenue - 1760); // base + new

  const totalCompletedBookingsCount = bookings.filter(b => b.status === 'Completed' || b.status === 'Confirmed').length;
  const activeClientsCount = clients.filter(c => c.status === 'Active').length;
  const approvedReviewsCount = reviews.filter(r => r.status === 'Approved').length;
  const activeCouponsCount = coupons.filter(c => c.status === 'Active').length;

  // Let's create an elegant custom interactive line chart using highly aesthetic SVGs
  const monthlyData = analytics.monthlyRevenue;
  const maxAmount = Math.max(...monthlyData.map((d) => d.amount));
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  // Compute SVG plot points for custom line graph
  const points = monthlyData.map((d, index) => {
    const x = paddingX + (index * (svgWidth - paddingX * 2)) / (monthlyData.length - 1);
    const y = svgHeight - paddingY - (d.amount / maxAmount) * (svgHeight - paddingY * 2);
    return { x, y, ...d, index };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    // Draw curves
    const prev = points[i - 1];
    const cpX1 = prev.x + (p.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (p.x - prev.x) / 2;
    const cpY2 = p.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
  }, '');

  // Gradient area formula
  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div id="analytics_dashboard" className="space-y-8 font-sans pb-12 selection:bg-amber-800 selection:text-white">
      {/* Header section with brand feel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light text-white tracking-wide">
            Performance <span className="italic font-medium text-amber-200">Insights</span>
          </h1>
          <p className="text-slate-405 text-xs mt-1">
            Real-time aesthetic performance indicators and salon operations metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-3.5 py-2 rounded-xl text-slate-300 font-sans text-xs font-semibold border border-white/10 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live Studio Sync &bull; 2026 Season
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div id="kpi_grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total revenue */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-[0_2px_12px_rgba(255,255,255,0.01)] backdrop-blur-md transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Estimated Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-200" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-3xl font-light text-white">
              ${currentTotalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </h3>
            <p className="text-xs text-emerald-400 font-sans font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +{analytics.revenueGrowth}% <span className="text-slate-500 font-normal">v last month</span>
            </p>
          </div>
        </motion.div>

        {/* Total bookings count */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-[0_2px_12px_rgba(255,255,255,0.01)] backdrop-blur-md transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Atelier Bookings</span>
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-slate-300" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-3xl font-light text-white">
              {totalCompletedBookingsCount + analytics.totalBookings}
            </h3>
            <p className="text-xs text-emerald-400 font-sans font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +{analytics.bookingsGrowth}% <span className="text-slate-500 font-normal">organic bookings</span>
            </p>
          </div>
        </motion.div>

        {/* Average Order Value */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-[0_2px_12px_rgba(255,255,255,0.01)] backdrop-blur-md transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Average Ticket</span>
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-3xl font-light text-white">
              ${analytics.averageOrderValue}
            </h3>
            <p className="text-xs text-emerald-400 font-sans font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +{analytics.aovGrowth}% <span className="text-slate-500 font-normal">luxury treatments</span>
            </p>
          </div>
        </motion.div>

        {/* Average Customer Retention */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-[0_2px_12px_rgba(255,255,255,0.01)] backdrop-blur-md transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Active Clients</span>
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <UsersRound className="w-5 h-5 text-slate-300" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-serif text-3xl font-light text-white">
              {activeClientsCount} Clients
            </h3>
            <p className="text-xs text-emerald-400 font-sans font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {analytics.retentionRate}% <span className="text-slate-500 font-normal">re-booking rate</span>
            </p>
          </div>
        </motion.div>

      </div>

      {/* Main Charts & Popularity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Panel */}
        <div id="revenue_chart_panel" className="bg-white/5 p-6 rounded-2xl border border-white/10 lg:col-span-2 shadow-[0_2px_12px_rgba(255,255,255,0.01)] backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-serif text-lg text-white font-medium">Monthly Revenue Curve</h3>
                <p className="text-slate-400 text-xs">Aura Luxe Salon Revenue Trajectory in 2026</p>
              </div>
              <div className="flex gap-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  Total Income
                </span>
              </div>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="relative w-full overflow-hidden mt-6">
              <svg 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                className="w-full h-auto drop-shadow-xl"
              >
                <defs>
                  {/* Luxury Amber Shimmer Gradient */}
                  <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </linearGradient>
                  
                  <linearGradient id="chart-line-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const y = paddingY + ratio * (svgHeight - paddingY * 2);
                  return (
                    <line 
                      key={i} 
                      x1={paddingX} 
                      y1={y} 
                      x2={svgWidth - paddingX} 
                      y2={y} 
                      stroke="rgba(255, 255, 255, 0.08)" 
                      strokeWidth="0.8" 
                      strokeDasharray="4 4" 
                    />
                  );
                })}

                {/* Shimmer Area */}
                <path d={areaD} fill="url(#chart-area-grad)" />

                {/* Elegant curved Line */}
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke="url(#chart-line-grad)" 
                  strokeWidth="3.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />

                {/* Circles & Interaction points */}
                {points.map((p) => {
                  const isSelected = selectedMonthIndex === p.index;
                  return (
                    <g key={p.index}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isSelected ? 6 : 4}
                        fill={isSelected ? '#f59e0b' : '#0c0c0c'}
                        stroke="#f59e0b"
                        strokeWidth={isSelected ? 3 : 2}
                        className="transition-all duration-150 cursor-pointer"
                        onMouseEnter={() => setSelectedMonthIndex(p.index)}
                        onMouseLeave={() => setSelectedMonthIndex(null)}
                      />
                    </g>
                  );
                })}

                {/* X Axis Labels */}
                {points.map((p) => (
                  <text
                    key={p.index}
                    x={p.x}
                    y={svgHeight - 10}
                    textAnchor="middle"
                    fill="#94a3b8"
                    style={{ fontSize: '10px', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                  >
                    {p.month}
                  </text>
                ))}

                {/* Y Axis Max Label */}
                <text
                  x={paddingX - 10}
                  y={paddingY + 4}
                  textAnchor="end"
                  fill="#94a3b8"
                  style={{ fontSize: '9px', fontFamily: 'Inter, sans-serif' }}
                >
                  ${(maxAmount / 1000).toFixed(0)}k
                </text>
                <text
                  x={paddingX - 10}
                  y={svgHeight - paddingY}
                  textAnchor="end"
                  fill="#94a3b8"
                  style={{ fontSize: '9px', fontFamily: 'Inter, sans-serif' }}
                >
                  $0
                </text>
              </svg>

              {/* Dynamic Interactive Tooltip */}
              <div className="h-10 mt-2 text-center">
                {selectedMonthIndex !== null ? (
                  <div className="inline-block bg-white/10 text-amber-200 text-xs px-4 py-1.5 rounded-full shadow-lg border border-white/10 backdrop-blur-md">
                    <span className="font-semibold text-white">{monthlyData[selectedMonthIndex].month}:</span>{' '}
                    <span>${monthlyData[selectedMonthIndex].amount.toLocaleString()} Revenue</span> &bull;{' '}
                    <span className="text-amber-400 font-mono">{monthlyData[selectedMonthIndex].bookings} bookings</span>
                  </div>
                ) : (
                  <p className="text-slate-400 text-[11px]">Hover over nodes to explore deep analytics insights.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Popular Service Breakdown */}
        <div id="service_populars" className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-[0_2px_12px_rgba(255,255,255,0.01)] backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg text-white font-medium">Service Popularity</h3>
            <p className="text-slate-400 text-xs mb-6">Most requested treatments</p>

            <div className="space-y-4">
              {analytics.servicePopularity.map((service, index) => {
                const totalSpentOnCurrent = service.revenue;
                const percent = (totalSpentOnCurrent / 55800) * 100;
                return (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium text-xs font-sans">{service.name}</span>
                      <span className="text-amber-200 font-mono text-xs font-semibold">
                        {service.count} <span className="text-slate-500 font-normal">({percent.toFixed(0)}%)</span>
                      </span>
                    </div>
                    {/* Custom Luxury Progress Bar with subtle gold glow */}
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 mt-6">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-sans">Platform Retention Limit</span>
              <span className="text-white font-semibold uppercase tracking-wider text-[11px]">Active (84.5%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Top Specialists & Studio Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Specialists list */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 lg:col-span-2 shadow-[0_2px_12px_rgba(255,255,255,0.01)] backdrop-blur-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-serif text-lg text-white font-medium">Stylist & Specialist Register</h3>
              <p className="text-slate-400 text-xs">Individual productivity & guest ratings</p>
            </div>
            <div className="p-1 px-3 bg-white/5 text-amber-200 border border-white/10 text-[10px] font-semibold rounded-lg flex items-center gap-1 backdrop-blur-sm">
              <Award className="w-3 h-3 text-amber-400" />
              Aura Master List
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px] font-semibold">
                  <th className="pb-3 text-left">Specialist</th>
                  <th className="pb-3 text-center">Satisfaction</th>
                  <th className="pb-3 text-center">Bookings</th>
                  <th className="pb-3 text-right">Income Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {analytics.specialistPerformance.map((spec, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors text-xs font-sans">
                    <td className="py-3.5 flex items-center gap-3">
                      <img
                        src={spec.image}
                        alt={spec.name}
                        className="w-9 h-9 rounded-full object-cover border border-white/15"
                      />
                      <div>
                        <p className="font-medium text-slate-200">{spec.name}</p>
                        <p className="text-[10px] text-slate-400 font-sans">Atelier Specialist</p>
                      </div>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-200 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md font-mono text-[10px]">
                        ★ {spec.rating.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3.5 text-center font-mono text-slate-300">
                      {spec.bookings}
                    </td>
                    <td className="py-3.5 text-right font-semibold font-sans text-white">
                      ${spec.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Realtime Action Logs */}
        <div className="bg-white/5 text-slate-200 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <h3 className="font-serif text-lg text-amber-200 font-medium">Atelier Logs</h3>
            <p className="text-slate-400 text-xs mb-4">Immediate system logs & events</p>
            
            <div className="space-y-4 font-mono text-[11px] leading-relaxed">
              <div className="border-l-2 border-amber-500/50 pl-3">
                <p className="text-slate-400">18:21:07 - <span className="text-amber-400">[Secure Login]</span></p>
                <p className="text-slate-300">Access granted to Admin Genevieve Laurent.</p>
              </div>
              <div className="border-l-2 border-white/10 pl-3">
                <p className="text-slate-400">16:45:10 - <span className="text-emerald-400">[Payment Paid]</span></p>
                <p className="text-slate-300">Client DuPont paid B-8711 ($280).</p>
              </div>
              <div className="border-l-2 border-white/10 pl-3">
                <p className="text-slate-400">13:10:05 - <span className="text-blue-400">[Coupon Registered]</span></p>
                <p className="text-slate-300">Coupon AURALUXE15 applied. Rate adjusted.</p>
              </div>
              <div className="border-l-2 border-white/10 pl-3">
                <p className="text-slate-400">11:00:00 - <span className="text-amber-400">[Review Approved]</span></p>
                <p className="text-slate-300">Elena Rostova 5-star review cataloged.</p>
              </div>
            </div>
          </div>

          <div className="bg-black/35 border border-white/10 rounded-xl p-3 text-[10px] text-slate-400 mt-6 sm:mt-4 leading-relaxed font-sans">
            <strong className="text-amber-200 block mb-0.5 uppercase tracking-wider font-mono">Operations Directive:</strong> Ensure all facial suites are clean 15 mins prior to client arrival.
          </div>
        </div>

      </div>

    </div>
  );
}
