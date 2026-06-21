import React, { useState, Dispatch, SetStateAction } from 'react';
import { Search, Plus, Calendar, Clock, Sparkles, Filter, ChevronDown, CheckCircle2, AlertCircle, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking, BookingStatus, PaymentStatus } from '../types';

interface BookingsProps {
  bookings: Booking[];
  setBookings: Dispatch<SetStateAction<Booking[]>>;
}

const LUXURY_SERVICES = [
  { name: '24K Gold Dust Signature Facial', price: 280, defaultSpecialist: 'Elena Rostova' },
  { name: 'Luxe Caviar Hydrating Cure', price: 320, defaultSpecialist: 'Elena Rostova' },
  { name: 'Platinum Velvet Balayage & Blowout', price: 450, defaultSpecialist: 'Julian Vance' },
  { name: 'Aroma Imperial Hot Stone Ritual', price: 250, defaultSpecialist: 'Marcus Thorne' },
  { name: 'Satin Silk Lash Extensions (Full Set)', price: 190, defaultSpecialist: 'Chloe Laurent' },
  { name: 'Sculpted Gel-X Couture Overlay', price: 160, defaultSpecialist: 'Saffron Bell' },
];

const SPECIALISTS = [
  'Elena Rostova',
  'Julian Vance',
  'Marcus Thorne',
  'Chloe Laurent',
  'Saffron Bell'
];

export default function Bookings({ bookings, setBookings }: BookingsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // New Booking State
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newService, setNewService] = useState(LUXURY_SERVICES[0]);
  const [newPrice, setNewPrice] = useState(LUXURY_SERVICES[0].price);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('11:00 AM');
  const [newSpecialist, setNewSpecialist] = useState(LUXURY_SERVICES[0].defaultSpecialist);
  const [newNotes, setNewNotes] = useState('');

  // Selected Booking Details modal simulation state
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);

  // Filters combined
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.specialistName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesPayment = paymentFilter === 'All' || b.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleServiceChange = (serviceName: string) => {
    const selected = LUXURY_SERVICES.find((s) => s.name === serviceName);
    if (selected) {
      setNewService(selected);
      setNewPrice(selected.price);
      setNewSpecialist(selected.defaultSpecialist);
    }
  };

  const handleAddBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientEmail || !newDate || !newTime) return;

    const newBookingRecord: Booking = {
      id: `B-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: newClientName,
      clientEmail: newClientEmail,
      serviceName: newService.name,
      price: Number(newPrice),
      bookingDate: newDate,
      bookingTime: newTime,
      specialistName: newSpecialist,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      notes: newNotes,
    };

    setBookings([newBookingRecord, ...bookings]);

    // Reset Form
    setNewClientName('');
    setNewClientEmail('');
    setNewNotes('');
    setShowAddForm(false);
  };

  const updateBookingStatus = (id: string, nextStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: nextStatus } : b))
    );
    if (viewingBooking?.id === id) {
      setViewingBooking((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
  };

  const updatePaymentStatus = (id: string, nextPayment: PaymentStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, paymentStatus: nextPayment } : b))
    );
    if (viewingBooking?.id === id) {
      setViewingBooking((prev) => (prev ? { ...prev, paymentStatus: nextPayment } : null));
    }
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setViewingBooking(null);
  };

  return (
    <div id="booking_atelier_pane" className="space-y-6 font-sans pb-12 selection:bg-amber-800 selection:text-white relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light text-white tracking-wide">
            Booking <span className="italic font-medium text-amber-200 font-serif">Atelier</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Review guest schedules, modify salon assignment queues, and alter billing statuses of high-end beauty rituals.
          </p>
        </div>
        
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            // Set default date of today
            if (!newDate) {
              const today = new Date().toISOString().split('T')[0];
              setNewDate(today);
            }
          }}
          className="bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-black text-xs font-semibold uppercase tracking-wider py-3 px-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-955/10 self-start md:self-auto border border-amber-400/20"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Close Scheduler' : 'Secure New Booking'}
        </button>
      </div>

      {/* Appointment Creation Form Panel */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_4px_24px_rgba(255,255,255,0.01)] backdrop-blur-md relative">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
              <div className="flex items-center gap-2 mb-4 text-amber-200 font-serif text-base font-normal">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                Scheduler &bull; Elegant Guest Registration
              </div>

              <form onSubmit={handleAddBookingSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Client Name */}
                <div>
                  <label className="block text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-medium">Guest Full Name</label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:bg-[#121212]/40 text-xs py-2.5 px-3.5 rounded-lg focus:outline-none transition-all placeholder-slate-500 text-white"
                    placeholder="Anastasia Laurent"
                  />
                </div>

                {/* Client Email */}
                <div>
                  <label className="block text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-medium">Guest Email Address</label>
                  <input
                    type="email"
                    required
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:bg-[#121212]/40 text-xs py-2.5 px-3.5 rounded-lg focus:outline-none transition-all placeholder-slate-500 text-white"
                    placeholder="anastasia@couture.com"
                  />
                </div>

                {/* Service Selector */}
                <div>
                  <label className="block text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-medium">Aesthetic Treatment</label>
                  <select
                    value={newService.name}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:bg-[#121212]/40 text-xs py-2.5 px-3.5 rounded-lg focus:outline-none transition-all text-white [&>option]:bg-neutral-900"
                  >
                    {LUXURY_SERVICES.map((s, idx) => (
                      <option key={idx} value={s.name}>{s.name} (${s.price})</option>
                    ))}
                  </select>
                </div>

                {/* Custom Price */}
                <div>
                  <label className="block text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-medium">Rate ($)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:bg-[#121212]/40 text-xs py-2.5 px-3.5 rounded-lg focus:outline-none transition-all text-white"
                  />
                </div>

                {/* Appointment Date */}
                <div>
                  <label className="block text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-medium">Desired Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:bg-[#121212]/40 text-xs py-2.5 px-3.5 rounded-lg focus:outline-none transition-all text-white"
                  />
                </div>

                {/* Appointment Time Selection */}
                <div>
                  <label className="block text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-medium">Hour</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:bg-[#121212]/40 text-xs py-2.5 px-3.5 rounded-lg focus:outline-none transition-all text-white [&>option]:bg-neutral-900"
                  >
                    {['09:00 AM', '10:30 AM', '11:00 AM', '01:00 PM', '02:30 PM', '03:00 PM', '04:00 PM', '05:30 PM'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Style Director */}
                <div>
                  <label className="block text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-medium">Beautician/Director</label>
                  <select
                    value={newSpecialist}
                    onChange={(e) => setNewSpecialist(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:bg-[#121212]/40 text-xs py-2.5 px-3.5 rounded-lg focus:outline-none transition-all text-white [&>option]:bg-neutral-900"
                  >
                    {SPECIALISTS.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                {/* Customer Notes */}
                <div className="md:col-span-2">
                  <label className="block text-slate-400 text-[11px] uppercase tracking-wider mb-1.5 font-medium">Guest Notes/Requests</label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400 focus:bg-[#121212]/40 text-xs py-2.5 px-3.5 rounded-lg focus:outline-none transition-all placeholder-slate-500 text-white"
                    placeholder="Specific dietary teas, suite arrangements, skin specifications etc."
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
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 border border-amber-500/20 text-black font-semibold rounded-lg text-xs uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    Record Appointment
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Search Bar */}
      <div id="booking_filters" className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white/5 p-4 rounded-xl border border-white/10 shadow-[0_2px_8px_rgba(255,255,255,0.01)] backdrop-blur-md">
        {/* Search */}
        <div className="sm:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-amber-400/50 text-xs py-2.5 pl-10 pr-4 rounded-lg focus:outline-none transition-colors placeholder-slate-500 text-white"
            placeholder="Search client, service, beautician..."
          />
        </div>

        {/* Appointment Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-amber-400/50 text-xs py-2.5 px-3.5 rounded-lg focus:outline-none transition-colors text-slate-200 font-sans cursor-pointer [&>option]:bg-neutral-900"
          >
            <option value="All">All Booking Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Billing Status Filter */}
        <div className="relative">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-amber-400/50 text-xs py-2.5 px-3.5 rounded-lg focus:outline-none transition-colors text-slate-200 font-sans cursor-pointer [&>option]:bg-neutral-900"
          >
            <option value="All">All Billing Stats</option>
            <option value="Paid">Paid Only</option>
            <option value="Unpaid">Unpaid Only</option>
            <option value="Refunded">Refunded Only</option>
          </select>
        </div>
      </div>

      {/* Bookings Table List */}
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-[0_2px_12px_rgba(255,255,255,0.01)] backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="bookings_table">
            <thead>
              <tr className="bg-white/5 text-slate-400 uppercase tracking-wider text-[10px] font-semibold border-b border-white/10">
                <th className="py-4 px-5">ID & Guest</th>
                <th className="py-4 px-4">Treatment Required</th>
                <th className="py-4 px-4 text-center">Date & Hour</th>
                <th className="py-4 px-4">Beautician</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-center">Billing</th>
                <th className="py-4 px-5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-405 text-xs font-sans">
                    No registry matches the specified filtration keywords.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  return (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors text-xs font-sans text-slate-200">
                      <td className="py-3.5 px-5">
                        <p className="font-semibold text-[10px] text-amber-200 font-mono leading-none mb-1">{b.id}</p>
                        <p className="font-medium text-white">{b.clientName}</p>
                        <p className="text-[10px] text-slate-400">{b.clientEmail}</p>
                      </td>
                      <td className="py-3.5 px-4 font-normal text-slate-300">
                        {b.serviceName}
                        <p className="text-[10px] text-amber-200 font-semibold font-mono mt-0.5">${b.price}</p>
                      </td>
                      <td className="py-3.5 px-4 text-center font-normal">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-medium text-slate-200">{b.bookingDate}</span>
                          <span className="text-[10px] text-slate-400">{b.bookingTime}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="inline-block bg-white/5 border border-white/10 px-2 py-0.5 rounded-md font-sans text-[10px] font-medium text-slate-300">
                          {b.specialistName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                          className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-1 rounded-full border cursor-pointer focus:outline-none transition-colors [&>option]:bg-neutral-900 ${
                            b.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-350 border-emerald-500/30'
                              : b.status === 'Confirmed'
                              ? 'bg-blue-550/10 text-blue-300 border-blue-500/30'
                              : b.status === 'Cancelled'
                              ? 'bg-red-500/10 text-red-350 border-red-500/30'
                              : 'bg-white/5 text-slate-300 border-white/10'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            const statuses: PaymentStatus[] = ['Paid', 'Unpaid', 'Refunded'];
                            const currentIdx = statuses.indexOf(b.paymentStatus);
                            const next = statuses[(currentIdx + 1) % statuses.length];
                            updatePaymentStatus(b.id, next);
                          }}
                          className={`text-[10px] font-mono font-semibold px-2 border py-1 rounded-md transition-all cursor-pointer ${
                            b.paymentStatus === 'Paid'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-550/30'
                              : b.paymentStatus === 'Refunded'
                              ? 'bg-purple-500/10 text-purple-300 border-purple-550/30'
                              : 'bg-amber-500/10 text-amber-300 border-amber-550/30'
                          }`}
                        >
                          {b.paymentStatus}
                        </button>
                      </td>
                      <td className="py-3.5 px-5 text-right flex justify-end gap-1.5 mt-2 md:mt-0 items-center">
                        <button
                          onClick={() => setViewingBooking(b)}
                          className="p-1.5 text-slate-300 hover:text-amber-200 bg-white/5 border border-white/10 rounded-lg cursor-pointer transition-colors"
                          title="View Card Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteBooking(b.id)}
                          className="px-2 py-1 bg-red-955/20 text-red-405 hover:bg-red-900/30 border border-red-500/20 rounded-lg cursor-pointer transition-colors"
                          title="Purge"
                        >
                          Purge
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Viewing details Modal overlay */}
      <AnimatePresence>
        {viewingBooking && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/5 border border-white/10 backdrop-blur-xl text-slate-200 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="font-mono text-amber-205 font-semibold text-xs uppercase">{viewingBooking.id} &bull; Appointment Card</span>
                    <h2 className="font-serif text-2xl text-amber-200 tracking-wide mt-1">{viewingBooking.clientName}</h2>
                    <p className="text-slate-400 text-xs">{viewingBooking.clientEmail}</p>
                  </div>
                  <button
                    onClick={() => setViewingBooking(null)}
                    className="p-1 px-2.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Service Detail */}
                  <div className="bg-black/35 p-4 rounded-xl border border-white/5">
                    <p className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold">Treatment Required</p>
                    <p className="text-amber-200 font-medium text-sm mt-1">{viewingBooking.serviceName}</p>
                    <div className="flex justify-between mt-2 pt-2 border-t border-white/10 text-[11px]">
                      <span className="text-slate-500">Premium Cost</span>
                      <span className="text-amber-400 font-mono font-semibold">${viewingBooking.price} USD</span>
                    </div>
                  </div>

                  {/* Date, Time & Specialist */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/35 p-3 rounded-xl border border-white/5">
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold mb-1">Appointment Hour</p>
                      <span className="font-medium text-slate-200 block">{viewingBooking.bookingDate}</span>
                      <span className="text-[11px] text-amber-400 font-sans">{viewingBooking.bookingTime}</span>
                    </div>
                    <div className="bg-black/35 p-3 rounded-xl border border-white/5">
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold mb-1">Assigned specialist</p>
                      <span className="font-medium text-slate-200 block">{viewingBooking.specialistName}</span>
                      <span className="text-[10px] text-slate-500 uppercase">Aura Certified Artist</span>
                    </div>
                  </div>

                  {/* Notes */}
                  {viewingBooking.notes && (
                    <div className="bg-black/35 p-3.5 rounded-xl border border-white/5">
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold mb-1">Aesthetic specifications</p>
                      <p className="text-slate-300 italic">"{viewingBooking.notes}"</p>
                    </div>
                  )}

                  {/* Quick Adjustments */}
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold mb-2">Adjust Management Status</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] text-slate-500 mb-1 font-sans">Booking Status</p>
                        <select
                          value={viewingBooking.status}
                          onChange={(e) => updateBookingStatus(viewingBooking.id, e.target.value as BookingStatus)}
                          className="w-full bg-[#121212]/80 border border-white/10 px-3.5 py-2 rounded-lg focus:outline-none text-slate-200 focus:border-amber-400 font-sans"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-500 mb-1 font-sans">Billing Status</p>
                        <select
                          value={viewingBooking.paymentStatus}
                          onChange={(e) => updatePaymentStatus(viewingBooking.id, e.target.value as PaymentStatus)}
                          className="w-full bg-[#121212]/80 border border-white/10 px-3.5 py-2 rounded-lg focus:outline-none text-slate-200 focus:border-amber-400 font-sans"
                        >
                          <option value="Unpaid">Unpaid</option>
                          <option value="Paid">Paid</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between gap-3">
                  <button
                    onClick={() => {
                      if (confirm('Are you absolutely sure you want to permanently clear this luxury appointment?')) {
                        deleteBooking(viewingBooking.id);
                      }
                    }}
                    className="px-4 py-2 bg-red-955/20 text-red-400 border border-red-900/40 hover:bg-red-950/40 rounded-xl transition-all cursor-pointer font-sans"
                  >
                    Purge Record
                  </button>
                  <button
                    onClick={() => setViewingBooking(null)}
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-black font-semibold rounded-xl transition-all cursor-pointer font-sans"
                  >
                    Confirm Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
