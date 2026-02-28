"use client";

import { format, formatDuration, intervalToDuration } from "date-fns";
import { motion } from "framer-motion";
import {
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Edit,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Roles } from "@/constants/roles";
import {
  deleteBookingService,
  getBookings,
  patchBookingStatus,
} from "@/services/booking";
import { Booking, UserRole } from "@/types/booking/types";
import { ReviewModal } from "./ReviewModal";

interface MyBookingsProps {
  userRole: UserRole;
  userId: string;
}

const statusConfig: Record<
  Booking["status"],
  { label: string; color: string; bg: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    dot: "bg-amber-500",
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    dot: "bg-emerald-500",
  },
  COMPLETED: {
    label: "Completed",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    dot: "bg-blue-500",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    dot: "bg-rose-500",
  },
};

export const MyBookings = ({ userRole, userId }: MyBookingsProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Booking["status"] | "ALL">(
    "ALL",
  );
  const router = useRouter();
  const fetchBookings = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const data = await getBookings(userRole, userId);

      setBookings(data || []);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userRole, userId]);

  const updateBookingStatus = async (
    bookingId: string,
    newStatus: Booking["status"],
  ) => {
    try {
      const response = await patchBookingStatus(bookingId, newStatus);

      toast.success("Booking status updated successfully!");

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)),
      );

      toast.success("Status updated");
    } catch {
      toast.error("Update failed");
    }
  };
  type ReviewPayload = {
    bookingId: string;
    rating: number;
    comment: string;
    bookingStatus: Booking["status"]; // pass status from UI
  };

  const submitReview = async ({
    bookingId,
    rating,
    comment,
    bookingStatus,
  }: ReviewPayload) => {
    // 🔒 Prevent review unless completed
    if (bookingStatus !== "COMPLETED") {
      toast.error("You can only review after the session is completed");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reviews`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          rating,
          comment,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Review submitted successfully ⭐");

      // Optional: mark booking as reviewed
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, isReviewed: true } : b)),
      );
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };
  const deleteBooking = async (bookingId: string) => {
    if (!confirm("Delete this booking?")) return;
    try {
      const response = await deleteBookingService(bookingId);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const formatDateTime = (dateStr: string) =>
    format(new Date(dateStr), "EEEE, MMM d • h:mm a");

  const getDuration = (start: string, end: string) => {
    const duration = intervalToDuration({
      start: new Date(start),
      end: new Date(end),
    });
    return formatDuration(duration, { format: ["hours", "minutes"] });
  };

  const filteredBookings =
    statusFilter === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  const getOtherParty = (booking: Booking) => {
    if (userRole === Roles.student) return booking.tutor?.user;
    if (userRole === Roles.tutor) return booking.student;
    return booking.student; // for admin, show student (or both, but we handle separately)
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <Card className="border-dashed rounded-2xl bg-muted/20">
        <CardContent className="py-20 text-center space-y-4">
          <div className="h-20 w-20 mx-auto rounded-full bg-primary/5 flex items-center justify-center">
            <Calendar className="h-10 w-10 text-primary/40" />
          </div>
          <p className="text-xl font-semibold">No bookings yet</p>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {userRole === Roles.student &&
              "Browse tutors and book your first session to get started."}
            {userRole === Roles.tutor &&
              "Your upcoming sessions will appear here once students book."}
            {userRole === Roles.admin && "There are no bookings in the system."}
          </p>
          {userRole === Roles.student && (
            <Button onClick={() => router.push("/tutors")} className="mt-2">
              Find a tutor
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <Tabs
        defaultValue="ALL"
        value={statusFilter}
        onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
        className="w-full"
      >
        <TabsList className="h-auto p-1 bg-muted/50 rounded-full">
          <TabsTrigger value="ALL" className="rounded-full px-6">
            All
          </TabsTrigger>
          {Object.entries(statusConfig).map(([key, config]) => (
            <TabsTrigger
              key={key}
              value={key}
              className="rounded-full px-6 gap-2"
            >
              <span className={`h-2 w-2 rounded-full ${config.dot}`} />
              {config.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Bookings list */}
      <div className="grid gap-5">
        {filteredBookings.map((booking, i) => {
          const otherParty = getOtherParty(booking);
          const status = statusConfig[booking.status];
          const isPast =
            booking.slot && new Date(booking.slot.endTime) < new Date();

          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-background to-muted/20 shadow-md hover:shadow-xl transition-all duration-300">
                {/* Status bar */}
                <div
                  className={`absolute left-0 top-0 h-full w-1.5 ${status.bg}`}
                />

                <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                      <AvatarImage
                        src={otherParty?.image || ""}
                        alt={otherParty?.name || ""}
                      />
                      <AvatarFallback className="bg-primary/10">
                        {otherParty?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        {userRole === Roles.admin ? (
                          <>
                            <span>{booking.student?.name}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.tutor?.user.name}</span>
                          </>
                        ) : (
                          otherParty?.name
                        )}
                      </CardTitle>

                      {booking.slot && (
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              {format(
                                new Date(booking.slot.startTime),
                                "MMM d, yyyy",
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {format(
                                new Date(booking.slot.startTime),
                                "h:mm a",
                              )}{" "}
                              –{" "}
                              {format(new Date(booking.slot.endTime), "h:mm a")}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {getDuration(
                              booking.slot.startTime,
                              booking.slot.endTime,
                            )}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <Badge
                    className={`${status.bg} ${status.color} border-0 rounded-full px-3 py-1 text-xs font-medium`}
                  >
                    <span
                      className={`mr-1.5 h-2 w-2 rounded-full ${status.dot}`}
                    />
                    {status.label}
                  </Badge>
                </CardHeader>

                {booking.review && (
                  <CardContent className="pb-2 pt-0">
                    <div className="flex items-start gap-2 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mt-0.5" />
                      <span className="text-muted-foreground line-clamp-2">
                        "{booking.review.comment}"
                      </span>
                    </div>
                  </CardContent>
                )}

                <CardFooter className="flex flex-wrap justify-end gap-2 border-t bg-muted/5 px-6 py-3">
                  {/* Tutor actions */}
                  {userRole === Roles.tutor && booking.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        className="rounded-full"
                        onClick={() =>
                          updateBookingStatus(booking.id, "CONFIRMED")
                        }
                      >
                        <Check className="mr-2 h-4 w-4" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full text-destructive hover:bg-destructive/10 border-destructive/20"
                        onClick={() =>
                          updateBookingStatus(booking.id, "CANCELLED")
                        }
                      >
                        <X className="mr-2 h-4 w-4" /> Decline
                      </Button>
                    </>
                  )}
                  {userRole === Roles.tutor &&
                    booking.status === "CONFIRMED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full text-green-600 hover:bg-green-600/10 border-green-600/20"
                        onClick={() =>
                          updateBookingStatus(booking.id, "COMPLETED")
                        }
                      >
                        <Check className="mr-2 h-4 w-4" /> Mark as Completed
                      </Button>
                    )}

                  {/* Student actions */}
                  {userRole === Roles.student && (
                    <>
                      {(booking.status === "PENDING" ||
                        booking.status === "CONFIRMED") && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full text-destructive hover:bg-destructive/10 border-destructive/20"
                          onClick={() =>
                            updateBookingStatus(booking.id, "CANCELLED")
                          }
                        >
                          <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                      )}

                      {booking.status === "COMPLETED" && !booking.review && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => {
                            setSelectedBookingId(booking.id);
                            setReviewModalOpen(true);
                          }}
                        >
                          <Star className="mr-2 h-4 w-4" /> Leave review
                        </Button>
                      )}
                    </>
                  )}

                  {/* Admin actions */}
                  {userRole === Roles.admin && (
                    <>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                          >
                            <Edit className="mr-2 h-4 w-4" /> Change status
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          {(
                            [
                              "PENDING",
                              "CONFIRMED",
                              "COMPLETED",
                              "CANCELLED",
                            ] as const
                          ).map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() =>
                                updateBookingStatus(booking.id, status)
                              }
                              className="gap-2"
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${statusConfig[status].dot}`}
                              />
                              {statusConfig[status].label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button
                        size="sm"
                        variant="destructive"
                        className="rounded-full"
                        onClick={() => deleteBooking(booking.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <ReviewModal
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        bookingId={selectedBookingId}
        tutorId={bookings.find((b) => b.id === selectedBookingId)?.tutorId}
        onSuccess={fetchBookings}
      />
    </div>
  );
};
