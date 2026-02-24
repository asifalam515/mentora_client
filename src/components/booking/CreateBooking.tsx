"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { userService } from "@/services/user.service"; // Your server action
import { format } from "date-fns";
import { Calendar, Clock, Loader2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CreateBookingProps {
  slotId: string;
  tutorName?: string;
  startTime?: string;
  endTime?: string;
  price?: number;
  subject?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateBooking({
  slotId,
  tutorName,
  startTime,
  endTime,
  price,
  subject,
  onSuccess,
  onCancel,
}: CreateBookingProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [slotDetails, setSlotDetails] = useState<{
    tutorName: string;
    startTime: string;
    endTime: string;
    price: number;
    subject: string;
  } | null>(null);
  const [fetchingSlot, setFetchingSlot] = useState(false);

  // 1. Get student ID from session
  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data, error } = await userService.getSession();
        if (error || !data?.user) {
          toast.info("Please log in to book a session.", {
            id: "login-required",
          });
          router.push("/login?callbackUrl=" + window.location.pathname);
          return;
        }
        // Ensure the user is a student (optional – backend will validate role)
        setStudentId(data.user.id);
      } catch (err) {
        console.error("Session error:", err);
      } finally {
        setLoadingSession(false);
      }
    };
    loadSession();
  }, [router]);

  // 2. If props missing, fetch slot details from API
  useEffect(() => {
    if (!slotId) return;
    if (tutorName && startTime && endTime && price !== undefined && subject) {
      setSlotDetails({ tutorName, startTime, endTime, price, subject });
      return;
    }
    const fetchSlotDetails = async () => {
      setFetchingSlot(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/availability/${slotId}`,
        );
        if (!res.ok) throw new Error("Failed to fetch slot details");
        const data = await res.json();
        setSlotDetails({
          tutorName: data.tutor.name,
          startTime: data.startTime,
          endTime: data.endTime,
          price: data.pricePerHr,
          subject: data.subject || "General",
        });
      } catch (err) {
        toast.error("Could not load booking details. Please try again.", {
          id: "slot-fetch-error",
        });
        console.error(err);
      } finally {
        setFetchingSlot(false);
      }
    };
    fetchSlotDetails();
  }, [slotId, tutorName, startTime, endTime, price, subject]);

  const handleBooking = async () => {
    if (!studentId) {
      toast.error("You must be logged in to book a session.", {
        id: "not-logged-in",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bookings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId,
            slotId,
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Booking failed");
      }
      toast.success("Booking confirmed! Check your dashboard for details.", {
        id: "booking-success",
      });
      if (onSuccess) onSuccess();
      // Optionally redirect to bookings page after a short delay
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while booking. Please try again.",
        { id: "booking-error" },
      );
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingSession || fetchingSlot) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!slotDetails) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center text-muted-foreground">
          Could not load booking details.
        </CardContent>
      </Card>
    );
  }

  const formattedStart = format(
    new Date(slotDetails.startTime),
    "MMMM d, yyyy 'at' h:mm a",
  );
  const formattedEnd = format(new Date(slotDetails.endTime), "h:mm a");

  return (
    <Card className="w-full max-w-md mx-auto border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Confirm Your Booking
        </CardTitle>
        <CardDescription>
          Please review the details before confirming.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tutor info */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tutor</p>
            <p className="font-medium">{slotDetails.tutorName}</p>
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">When</p>
            <p className="font-medium">
              {formattedStart} – {formattedEnd}
            </p>
          </div>
        </div>

        {/* Subject */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Subject</p>
            <p className="font-medium">{slotDetails.subject}</p>
          </div>
        </div>

        <Separator />

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="text-2xl font-bold text-primary">
            ${slotDetails.price}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button
          onClick={handleBooking}
          disabled={isSubmitting}
          className="flex-1 gap-2"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Booking..." : "Confirm Booking"}
        </Button>
      </CardFooter>
    </Card>
  );
}
