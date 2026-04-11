export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "STUDENT";
  createdAt: string;
  bookings?: unknown[];
  reviews?: unknown[];
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
  stripeConnectedAccountId?: string | null;
  stripeOnboardingComplete?: boolean;
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
