export interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  slotId: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  date: string; // ISO string
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  student?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  tutor?: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  };
  slot?: {
    startTime: string;
    endTime: string;
  };
  review?: {
    id: string;
    rating: number;
    comment: string;
  } | null;
}

export type UserRole = "STUDENT" | "TUTOR" | "ADMIN";
