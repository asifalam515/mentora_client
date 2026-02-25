"use client";
import { MyBookings } from "@/components/booking/MyBookings";
import { authClient } from "@/lib/auth";

const BookingsPage = () => {
  const { data, isPending } = authClient.useSession();
  const customerRole = (data?.user as any)?.role;

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <MyBookings
        userRole={customerRole || "STUDENT"}
        userId={data?.user.id || ""}
      />
    </div>
  );
};

export default BookingsPage;
