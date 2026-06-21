import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Clock, LogOut } from 'lucide-react';

// Subcomponents
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Analytics from './components/Analytics';
import Bookings from './components/Bookings';
import Users from './components/Users';
import Coupons from './components/Coupons';
import Reviews from './components/Reviews';

// Mock/Initial Data
import { 
  INITIAL_CLIENTS, 
  INITIAL_BOOKINGS, 
  INITIAL_COUPONS, 
  INITIAL_REVIEWS, 
  INITIAL_ANALYTICS 
} from './data';
import { AdminUser, ClientUser, Booking, Coupon, Review, StudioAnalytics } from './types';

export default function App() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('analytics');

  // Core registries with localStorage persistence
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [analytics, setAnalytics] = useState<StudioAnalytics>(INITIAL_ANALYTICS);

  // UTC or local time representation
  const [currentTime, setCurrentTime] = useState(new Date());

  // Initialize and load state
  useEffect(() => {
    // Admin login persistent check
    const storedAdmin = localStorage.getItem('aura_luxe_admin');
    if (storedAdmin) {
      try {
        setAdminUser(JSON.parse(storedAdmin));
      } catch (e) {
        console.error('Failed to parse admin user storage', e);
      }
    }

    // Load registries or initialize
    const storedClients = localStorage.getItem('aura_luxe_clients');
    if (storedClients) {
      try { setClients(JSON.parse(storedClients)); } catch (_) {}
    } else {
      setClients(INITIAL_CLIENTS);
    }

    const storedBookings = localStorage.getItem('aura_luxe_bookings');
    if (storedBookings) {
      try { setBookings(JSON.parse(storedBookings)); } catch (_) {}
    } else {
      setBookings(INITIAL_BOOKINGS);
    }

    const storedCoupons = localStorage.getItem('aura_luxe_coupons');
    if (storedCoupons) {
      try { setCoupons(JSON.parse(storedCoupons)); } catch (_) {}
    } else {
      setCoupons(INITIAL_COUPONS);
    }

    const storedReviews = localStorage.getItem('aura_luxe_reviews');
    if (storedReviews) {
      try { setReviews(JSON.parse(storedReviews)); } catch (_) {}
    } else {
      setReviews(INITIAL_REVIEWS);
    }
  }, []);

  // Sync state modifications to storage
  useEffect(() => {
    if (clients.length > 0) {
      localStorage.setItem('aura_luxe_clients', JSON.stringify(clients));
    }
  }, [clients]);

  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem('aura_luxe_bookings', JSON.stringify(bookings));
    }
  }, [bookings]);

  useEffect(() => {
    if (coupons.length > 0) {
      localStorage.setItem('aura_luxe_coupons', JSON.stringify(coupons));
    }
  }, [coupons]);

  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem('aura_luxe_reviews', JSON.stringify(reviews));
    }
  }, [reviews]);

  // Clock Update Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    localStorage.setItem('aura_luxe_admin', JSON.stringify(user));
  };

  const handleLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('aura_luxe_admin');
  };

  const renderActiveTabContent = () => {
    switch (currentTab) {
      case 'analytics':
        return (
          <Analytics 
            analytics={analytics} 
            clients={clients} 
            bookings={bookings} 
            reviews={reviews} 
            coupons={coupons}
          />
        );
      case 'bookings':
        return <Bookings bookings={bookings} setBookings={setBookings} />;
      case 'users':
        return <Users clients={clients} setClients={setClients} />;
      case 'coupons':
        return <Coupons coupons={coupons} setCoupons={setCoupons} />;
      case 'reviews':
        return <Reviews reviews={reviews} setReviews={setReviews} />;
      default:
        return (
          <div className="text-center py-12 text-stone-500 text-xs">
            Aesthetic view index under construction.
          </div>
        );
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const formattedDateString = `${monthNames[currentTime.getMonth()]} ${currentTime.getDate()}, ${currentTime.getFullYear()}`;
  const formattedTimeString = currentTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  if (!adminUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-slate-200 flex flex-col lg:flex-row relative selection:bg-amber-800 selection:text-white overflow-hidden">
      {/* Mesh Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/15 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-amber-900/10 blur-[140px] rounded-full"></div>
      </div>

      {/* Sidebar navigation */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        admin={adminUser} 
        onLogout={handleLogout} 
      />

      {/* Main Panel Surface */}
      <main className="flex-1 min-w-0 flex flex-col pt-16 lg:pt-0 z-10 relative overflow-y-auto">
        
        {/* Luxury top greeting ribbon */}
        <header className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-md px-6 flex items-center justify-between z-10 shrink-0">
          {/* Welcome directive */}
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-sans text-slate-400 font-medium tracking-widest uppercase hidden sm:inline-block">Comfort Quote:</span>
            <span className="font-serif italic text-xs text-amber-200/80 hidden sm:inline-block">"Elegance is not standing out, but being remembered."</span>
          </div>

          {/* Time and Active details */}
          <div className="flex items-center gap-4 text-xs font-sans text-slate-400">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Calendar className="w-3.5 h-3.5 text-amber-500/80" />
              <span className="font-semibold text-slate-300 text-[10px]">{formattedDateString}</span>
              <span className="text-white/10">|</span>
              <Clock className="w-3.5 h-3.5 text-amber-500/80" />
              <span className="font-mono font-bold text-slate-200 text-[10px]">{formattedTimeString}</span>
            </div>
          </div>
        </header>

        {/* Dynamic content rendering with subtle animations */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {renderActiveTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}
