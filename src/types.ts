export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'Super Admin' | 'Manager' | 'Receptionist';
  avatar?: string;
  lastLogin?: string;
}

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  totalBookings: number;
  totalSpent: number;
  status: 'Active' | 'Suspended';
  notes?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  expiryDate: string;
  status: 'Active' | 'Expired';
  usageLimit: number;
  usageCount: number;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Unpaid' | 'Paid' | 'Refunded';

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  price: number;
  bookingDate: string;
  bookingTime: string;
  specialistName: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
}

export interface Review {
  id: string;
  reviewerName: string;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Pending Approval' | 'Approved' | 'Deleted';
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface StudioAnalytics {
  totalRevenue: number;
  revenueGrowth: number; // percentage
  totalBookings: number;
  bookingsGrowth: number; // percentage
  averageOrderValue: number;
  aovGrowth: number; // percentage
  retentionRate: number; // percentage
  retentionGrowth: number; // percentage
  monthlyRevenue: { month: string; amount: number; bookings: number }[];
  servicePopularity: { name: string; count: number; revenue: number }[];
  specialistPerformance: { name: string; rating: number; bookings: number; revenue: number; image: string }[];
}
