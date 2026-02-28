"use client";
import { MyBookings } from "@/components/booking/MyBookings";
import { useAuthStore } from "@/store/useAuthStore.ts";

const BookingsPage = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const customerRole = user?.role;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <MyBookings
        userRole={customerRole || "STUDENT"}
        userId={user?.id || ""}
      />
    </div>
  );
};

export default BookingsPage;
