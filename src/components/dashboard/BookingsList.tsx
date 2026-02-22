import { MyBookings } from "../booking/MyBookings";

export function BookingsList({ title, list }: any) {
  return (
    <div>
      <h2 className="font-semibold mb-2">{title}</h2>
      <MyBookings></MyBookings>
    </div>
  );
}
