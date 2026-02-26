"use client";

import { format } from "date-fns";
import { Calendar, Clock, Loader2, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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

interface AvailabilitySlot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface AvailableSlotsForBookingProps {
  tutorId: string;
  onBookingSuccess?: () => void;
}

const AvailableSlotsForBooking = ({
  tutorId,
  onBookingSuccess,
}: AvailableSlotsForBookingProps) => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(
    null,
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/availability-slots/tutor/${tutorId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch slots");
      }

      const data = await response.json();

      // Filter out past slots (end time already passed)
      const now = new Date();
      const futureSlots = data.filter(
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

  const handleBookSlot = async (slotId: string) => {
    if (!session?.user) {
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

    // Prevent double-click
    if (bookingInProgress === slotId) return;

    setBookingInProgress(slotId);

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bookings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            studentId: session.user.id,
            slotId,
          }),
          signal,
        },
      );

      if (signal.aborted) return;

      if (!response.ok) {
        let errorMsg = "Booking failed";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorData.error || errorMsg;
        } catch {
          // ignore
        }
        throw new Error(errorMsg);
      }

      // Success – mark slot as booked in UI
      setSlots((prev) =>
        prev.map((s) => (s.id === slotId ? { ...s, isBooked: true } : s)),
      );

      toast.success("Booking confirmed! 🎉");
      onBookingSuccess?.();
    } catch (error: any) {
      if (error.name === "AbortError") return;
      console.error("Booking error:", error);
      toast.error(error.message || "Could not book slot");
    } finally {
      setBookingInProgress(null);
      abortControllerRef.current = null;
    }
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
              This tutor hasn't set any availability yet.
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
                    disabled={isBooked || bookingInProgress === slot.id}
                    variant={isAvailable ? "default" : "outline"}
                    className={`gap-2 ${
                      isBooked ? "cursor-not-allowed opacity-60" : ""
                    }`}
                  >
                    {bookingInProgress === slot.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isBooked ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      <Calendar className="h-4 w-4" />
                    )}
                    {bookingInProgress === slot.id
                      ? "Booking..."
                      : isBooked
                        ? isPast
                          ? "Passed"
                          : "Booked"
                        : "Book"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableSlotsForBooking;
