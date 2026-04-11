"use client";

import { format } from "date-fns";
import { Calendar, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import PaymentFirstBookingDialog from "@/components/booking/PaymentFirstBookingDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getTutorAvailability } from "@/lib/booking";
import { useAuthStore } from "@/store/useAuthStore.ts";

interface AvailabilitySlot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface AvailableSlotsForBookingProps {
  tutorId: string;
  tutorHourlyRate?: number;
  onBookingSuccess?: () => void;
}

const AvailableSlotsForBooking = ({
  tutorId,
  tutorHourlyRate,
  onBookingSuccess,
}: AvailableSlotsForBookingProps) => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null,
  );
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const data = await getTutorAvailability(tutorId);

      // Filter out past slots (end time already passed)
      const now = new Date();
      const futureSlots = data?.filter(
        (slot: AvailabilitySlot) => new Date(slot.endTime) > now,
      );

      setSlots(futureSlots);
    } catch (error) {
      console.error("Fetch slots error:", error);
      toast.error("Could not load available slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tutorId) {
      fetchSlots();
    }
  }, [tutorId]);

  const handleBookSlot = (slotId: string) => {
    if (!user) {
      toast.error("Please log in to book a session");
      return;
    }

    const slot = slots.find((s) => s.id === slotId);
    if (!slot) return;

    // Double-check slot is not already booked (UI might be stale)
    if (slot.isBooked) {
      toast.error("This slot is already booked");
      return;
    }

    setSelectedSlot(slot);
    setPaymentDialogOpen(true);
  };

  const handlePaymentSuccess = async () => {
    await fetchSlots();
    onBookingSuccess?.();
  };

  const formatSlotTime = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${format(startDate, "EEE, MMM d")} • ${format(
      startDate,
      "h:mm a",
    )} - ${format(endDate, "h:mm a")}`;
  };

  return (
    <Card className="shadow-md border-muted/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Sessions with this Tutor
        </CardTitle>
        <CardDescription>
          Available slots are highlighted; booked slots are marked.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="h-14 w-14 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No upcoming sessions</p>
            <p className="text-sm">
              This tutor has not set any availability yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {slots.map((slot) => {
              const isPast = new Date(slot.endTime) <= new Date();
              const isBooked = slot.isBooked || isPast; // treat past as booked
              const isAvailable = !isBooked;

              return (
                <div
                  key={slot.id}
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border transition ${
                    isAvailable
                      ? "hover:shadow-md border-green-200 dark:border-green-800"
                      : "border-muted bg-muted/20"
                  }`}
                >
                  <div className="space-y-1">
                    <p className="font-medium text-sm md:text-base">
                      {formatSlotTime(slot.startTime, slot.endTime)}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>60 minutes • Online</span>
                      {isBooked && (
                        <Badge variant="secondary" className="text-xs">
                          {isPast ? "Passed" : "Booked"}
                        </Badge>
                      )}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleBookSlot(slot.id)}
                    disabled={isBooked}
                    variant={isAvailable ? "default" : "outline"}
                    className={`gap-2 ${
                      isBooked ? "cursor-not-allowed opacity-60" : ""
                    }`}
                  >
                    {isBooked ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      <Calendar className="h-4 w-4" />
                    )}
                    {isBooked ? (isPast ? "Passed" : "Booked") : "Pay and Book"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <PaymentFirstBookingDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        slot={selectedSlot}
        tutorHourlyRate={tutorHourlyRate}
        onSuccess={handlePaymentSuccess}
      />
    </Card>
  );
};

export default AvailableSlotsForBooking;
