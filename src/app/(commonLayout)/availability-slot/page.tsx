"use client";
import AvailabilityManager from "@/components/tutor/AvailabilityManager";
import { authClient } from "@/lib/auth";

const AvailabilitySlot = () => {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) {
    return <div>Loading...</div>;
  }
  const userId = session?.user.id;

  return (
    <div>
      <AvailabilityManager tutorId={userId}></AvailabilityManager>
    </div>
  );
};

export default AvailabilitySlot;
