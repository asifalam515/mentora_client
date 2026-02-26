export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "STUDENT";
  createdAt: string;
  bookings?: any[];
  reviews?: any[];
}

export interface TutorProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  image?: string | null;
  bio: string;
  headline?: string | null;
  pricePerHr: number;
  rating: number;
  experience: number;
  isVerified: boolean;
  categories: { id: string; name: string }[];
  availability: AvailabilitySlot[];
  totalReviews?: number;
  completedSessions?: number;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "ADMIN";
  createdAt: string;
}

export interface AvailabilitySlot {
  id: string;
  startTime: string; // ISO string
  endTime: string;
  isBooked: boolean;
}
