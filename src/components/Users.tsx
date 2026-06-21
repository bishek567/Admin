import React, { useState, Dispatch, SetStateAction } from 'react';
import { Search, Plus, UserPlus, Sparkles, Filter, ShieldAlert, BadgeCheck, CheckCircle, Ban, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClientUser } from '../types';

interface UsersProps {
  clients: ClientUser[];
  setClients: Dispatch<SetStateAction<ClientUser[]>>;
}

export default function Users({ clients, setClients }: UsersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspended'>('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // New Client Fields
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Selected client details for inline edit or notes viewing
  const [selectedClient, setSelectedClient] = useState<ClientUser | null>(null);

  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPhone) return;

    const newClient: ClientUser = {
      id: `C-0${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      email: newEmail,
      phone: newPhone,
      joinedDate: new Date().toISOString().split('T')[0],
      totalBookings: 0,
      totalSpent: 0,
      status: 'Active',
      notes: newNotes,
    };

    setClients([newClient, ...clients]);

    // Reset Form
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewNotes('');
    setShowAddForm(false);
  };

  const toggleClientStatus = (id: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'Active' ? 'Suspended' : 'Active';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
    if (selectedClient?.id === id) {
      setSelectedClient((prev) =>
        prev ? { ...prev, status: prev.status === 'Active' ? 'Suspended' : 'Active' } : null
      );
    }
  };

  // Filtration logic
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate top spending tier clients
  const vipClients = clients.filter((c) => c.totalSpent >= 3000);

  return (
    <div id="client_register_page" className="space-y-6 font-sans pb-12 selection:bg-amber-800 selection:text-white relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light text-white tracking-wide">
            Client <span className="italic font-medium text-amber-250">Register</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Maintain and inspect the VIP guest index, review spent summaries, and alter account status configurations.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-black text-xs font-semibold uppercase tracking-wider py-3 px-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg self-start md:self-auto border border-amber-400/20"
        >
          {showAddForm ? <X className="w-4 h-4 text-black" /> : <UserPlus className="w-4 h-4 text-black" />}
          {showAddForm ? 'Close Enrollment' : 'Enroll Premium Guest'}
        </button>
      </div>

      {/* Guest Enrollment Form */}
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
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
              <div className="flex items-center gap-2 mb-4 text-amber-200 font-serif text-base font-normal">
                <Sparkles className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
                Register &bull; New Guest Enrollment
              </div>

              <form onSubmit={handleAddClientSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
                <div>
                  <label className="block text-slate-400 text-[11px] uppercase tracking-wider mb-1.5">Guest Legal Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400 text-xs text-white focus:outline-none placeholder-slate-500 focus:ring-0 rounded-xl py-3 px-3.5"
                    placeholder="Lady Catherine Sinclair"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] uppercase tracking-wider mb-1.5">Primary Email</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400 text-xs text-white focus:outline-none placeholder-slate-500 focus:ring-0 rounded-xl py-3 px-3.5"
                    placeholder="catherine@sinclair.co.uk"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] uppercase tracking-wider mb-1.5">Secretariat Phone</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400 text-xs text-white focus:outline-none placeholder-slate-500 focus:ring-0 rounded-xl py-3 px-3.5"
                    placeholder="+44 (7911) 123456"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-slate-400 text-[11px] uppercase tracking-wider mb-1.5">Service preferences & details (Tones, sensitivities, etc.)</label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400 text-xs text-white focus:outline-none placeholder-slate-500 focus:ring-0 rounded-xl py-3 px-3.5"
                    placeholder="E.g., allergic to specific nut extracts, prefers Earl Grey, regular bookings on Saturdays."
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
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 border border-amber-500/20 text-black font-semibold rounded-lg text-xs uppercase tracking-wider cursor-pointer font-sans"
                  >
                    Enroll Customer
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIP Spotlight Slider Bar */}
      <div id="vip_spotlights" className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-3 items-start">
          <div className="w-10 h-10 bg-white/5 text-amber-205 shrink-0 rounded-xl flex items-center justify-center border border-white/10">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-serif text-base text-amber-100 font-semibold tracking-wide">Studio Aura VIP Circle</h3>
            <p className="text-slate-400 text-xs">Exquisite patrons who spent more than $3,000 at the Atelier.</p>
          </div>
        </div>
        
        {/* VIP Avatars Display list */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {vipClients.map((c, i) => (
            <div 
              key={c.id} 
              className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[11px] font-sans shadow-sm backdrop-blur-md text-slate-205"
              title={`${c.name} has spent $${c.totalSpent}`}
            >
              <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-white">{c.name}</span>
              <span className="text-amber-200 font-mono font-bold">${(c.totalSpent/1000).toFixed(1)}k</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and search */}
      <div id="clients_search_belt" className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
        <div className="sm:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-450">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-amber-400/50 text-xs py-2.5 pl-10 pr-4 rounded-lg focus:outline-none transition-colors text-white placeholder-slate-500"
            placeholder="Search register via guest name, email address, telephone..."
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full bg-white/5 border border-white/10 focus:border-amber-400/50 text-xs py-2.5 px-3.5 rounded-lg focus:outline-none transition-colors text-slate-200 font-sans cursor-pointer [&>option]:bg-neutral-900"
          >
            <option value="All">All statuses</option>
            <option value="Active">Active registry</option>
            <option value="Suspended">Suspended accounts</option>
          </select>
        </div>
      </div>

      {/* Registers Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white/5 rounded-2xl border border-white/10 text-slate-400 text-xs backdrop-blur-md">
            No customer cards match the parameters specified.
          </div>
        ) : (
          filteredClients.map((client) => {
            const isVip = client.totalSpent >= 3000;
            return (
              <motion.div
                key={client.id}
                whileHover={{ y: -3 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(255,255,255,0.01)] backdrop-blur-md flex flex-col justify-between"
              >
                {/* Upper Details */}
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-slate-400 text-[10px] uppercase font-bold">{client.id}</span>
                      <h3 className="font-serif text-lg font-medium text-white flex items-center gap-1.5 mt-0.5">
                        {client.name}
                        {isVip && (
                          <span className="text-[9px] bg-amber-500/10 text-amber-205 tracking-wider uppercase font-semibold font-mono border border-amber-500/20 px-1.5 py-0.5 rounded-md">
                            VIP
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-400">{client.email}</p>
                    </div>

                    <div className="py-1 px-2.5 rounded-full text-[9px] font-semibold uppercase font-sans tracking-widest">
                      {client.status === 'Active' ? (
                        <span className="text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Active</span>
                      ) : (
                        <span className="text-red-300 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">Suspended</span>
                      )}
                    </div>
                  </div>

                  {/* Metrics block */}
                  <div className="grid grid-cols-3 gap-2 bg-white/5 border border-white/10 p-3 rounded-xl text-center">
                    <div>
                      <p className="text-[10px] text-slate-400 font-sans">Adorations</p>
                      <span className="font-serif text-sm font-semibold text-white font-mono">{client.totalBookings}</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-sans">Total spent</p>
                      <span className="font-serif text-sm font-semibold text-white font-mono">${client.totalSpent}</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-sans">Enroll date</p>
                      <span className="font-semibold text-[10px] text-slate-205 leading-none inline-block mt-1">{client.joinedDate.slice(5)}</span>
                    </div>
                  </div>

                  {/* Notes Preferences details */}
                  <div className="text-[11px] text-slate-300 bg-amber-500/5 border border-amber-450/10 p-3 rounded-lg leading-relaxed">
                    <p className="font-semibold text-amber-200 text-[10px] uppercase tracking-wider mb-0.5 font-sans">Patron preferences</p>
                    <p className="italic text-slate-400">{client.notes ? `"${client.notes}"` : 'No custom preference record created.'}</p>
                  </div>
                </div>

                {/* Footer Control Panel */}
                <div className="px-5 py-3 border-t border-white/10 bg-white/5 flex justify-between items-center text-xs">
                  <span className="text-[10px] font-mono text-slate-400 tracking-wide font-medium">{client.phone}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedClient(client);
                        setNewNotes(client.notes || '');
                      }}
                      className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 hover:text-white cursor-pointer"
                    >
                      Preferences
                    </button>
                    <button
                      onClick={() => toggleClientStatus(client.id)}
                      className={`text-[10px] uppercase tracking-wider font-semibold font-sans cursor-pointer ${
                        client.status === 'Active' 
                          ? 'text-red-400 hover:text-red-300' 
                          : 'text-emerald-400 hover:text-emerald-300'
                      }`}
                    >
                      {client.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Editing Preference Panel Modal */}
      <AnimatePresence>
        {selectedClient && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/5 border border-white/10 backdrop-blur-xl text-slate-200 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="font-mono text-amber-250 text-[10px] font-bold uppercase">{selectedClient.id}</span>
                    <h2 className="font-serif text-xl text-amber-200 font-light mt-1">{selectedClient.name} Preference Deck</h2>
                  </div>
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="p-1 text-slate-400 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-slate-400 text-[11px] uppercase tracking-wider mb-2 font-medium">Custom Preferences</label>
                    <textarea
                      rows={4}
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-400 rounded-xl p-3 text-xs text-white focus:outline-none placeholder-slate-600 focus:ring-0"
                      placeholder="Write premium tea selections, product allergies, suite setups, etc."
                    />
                  </div>

                  {/* Display details details */}
                  <div className="grid grid-cols-2 gap-3 bg-black/35 p-3 rounded-xl border border-white/10 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Total spendings</span>
                      <strong className="text-amber-200 font-mono">${selectedClient.totalSpent} Spend</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Status security</span>
                      <strong className={selectedClient.status === 'Active' ? 'text-emerald-400 font-mono' : 'text-red-400 font-mono'}>
                        {selectedClient.status}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 font-sans">
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setClients((prev) =>
                        prev.map((c) =>
                          c.id === selectedClient.id ? { ...c, notes: newNotes } : c
                        )
                      );
                      setSelectedClient(null);
                    }}
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-black font-semibold rounded-lg text-xs uppercase tracking-wider cursor-pointer font-sans"
                  >
                    Save Preferences
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
