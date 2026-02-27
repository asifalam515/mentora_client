"use client";
import AvailabilityManager from "@/components/tutor/AvailabilityManager";
import { useAuthStore } from "@/store/useAuthStore.ts";

const AvailabilitySlot = () => {
  const { user, isLoading } = useAuthStore();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const userId = user?.id as string;

  return (
    <div>
      <AvailabilityManager tutorId={userId}></AvailabilityManager>
    </div>
  );
};

export default AvailabilitySlot;
