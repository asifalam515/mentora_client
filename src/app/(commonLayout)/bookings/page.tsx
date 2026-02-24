"use client";
import { MyBookings } from "@/components/booking/MyBookings";
import { authClient } from "@/lib/auth";

const BookingsPage = () => {
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <MyBookings
        userRole={data?.user?.role || "STUDENT"}
        userId={data?.user.id || ""}
      />
    </div>
  );
};

export default BookingsPage;
