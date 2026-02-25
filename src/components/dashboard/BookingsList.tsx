import { authClient } from "@/lib/auth";
import { MyBookings } from "../booking/MyBookings";

export function BookingsList({ title, list }: any) {
  const { data, isPending } = authClient.useSession();
  return (
    <div>
      <h2 className="font-semibold mb-2">{title}</h2>
      <MyBookings userRole={(data?.user as any)?.role} userId={list.userId} />
    </div>
  );
}
