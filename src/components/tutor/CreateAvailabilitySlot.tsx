"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, isBefore } from "date-fns";
import { CalendarIcon, Clock, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// Schema for a new availability slot
const availabilitySlotSchema = z
  .object({
    date: z.date({ required_error: "Please select a date" }),
    startHour: z.string().min(1, "Start hour required"),
    startMinute: z.string().min(1, "Start minute required"),
    endHour: z.string().min(1, "End hour required"),
    endMinute: z.string().min(1, "End minute required"),
  })
  .refine(
    (data) => {
      const start = new Date(data.date);
      start.setHours(
        parseInt(data.startHour),
        parseInt(data.startMinute),
        0,
        0,
      );
      const end = new Date(data.date);
      end.setHours(parseInt(data.endHour), parseInt(data.endMinute), 0, 0);
      return isBefore(start, end);
    },
    { message: "End time must be after start time", path: ["endHour"] },
  );

type AvailabilitySlotForm = z.infer<typeof availabilitySlotSchema>;

interface AvailabilitySlot {
  id: string;
  startTime: string; // ISO string
  endTime: string;
  isBooked: boolean;
}

interface CreateAvailabilitySlotProps {
  tutorId: string;
}

const CreateAvailabilitySlot = ({ tutorId }: CreateAvailabilitySlotProps) => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );
  const minutes = ["00", "15", "30", "45"];

  const form = useForm<AvailabilitySlotForm>({
    resolver: zodResolver(availabilitySlotSchema),
    defaultValues: {
      date: new Date(),
      startHour: "09",
      startMinute: "00",
      endHour: "10",
      endMinute: "00",
    },
  });

  const fetchSlots = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/availability-slots?tutorId=${tutorId}`,
        { credentials: "include" },
      );
      if (!response.ok) throw new Error("Failed to fetch slots");
      const data = await response.json();
      setSlots(data);
    } catch (error) {
      toast.error("Error", {
        description: "Could not load availability slots",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [tutorId]);

  const onSubmit = async (data: AvailabilitySlotForm) => {
    setIsSubmitting(true);
    try {
      const startDateTime = new Date(data.date);
      startDateTime.setHours(
        parseInt(data.startHour),
        parseInt(data.startMinute),
        0,
        0,
      );

      const endDateTime = new Date(data.date);
      endDateTime.setHours(
        parseInt(data.endHour),
        parseInt(data.endMinute),
        0,
        0,
      );

      const payload = {
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        isBooked: false,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/availability-slots`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) throw new Error("Failed to create slot");

      toast.success("Slot created successfully");
      form.reset({
        date: data.date,
        startHour: data.endHour,
        startMinute: data.endMinute,
        endHour: (parseInt(data.endHour) + 1).toString().padStart(2, "0"),
        endMinute: "00",
      });
      fetchSlots();
    } catch (error) {
      toast.error("Error", { description: "Could not create slot" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (slotId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/availability-slots/${slotId}`,
        { method: "DELETE", credentials: "include" },
      );
      if (!response.ok) throw new Error("Failed to delete slot");
      toast.success("Slot deleted");
      fetchSlots();
    } catch (error) {
      toast.error("Error", { description: "Could not delete slot" });
    }
  };

  const formatSlotTime = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${format(startDate, "MMM d, yyyy")} • ${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}`;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Add Slot Form */}
      <Card className="shadow-md border-muted/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Clock className="h-5 w-5 text-primary" />
            Add Availability Slot
          </CardTitle>
          <CardDescription>
            Set your available time slots for students to book.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(field.value, "PPP")
                              : "Pick a date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                {/* Start Time */}
                <div className="space-y-3">
                  <FormLabel>Start Time</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="startHour"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Hour" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {hours.map((h) => (
                                <SelectItem key={h} value={h}>
                                  {h}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="startMinute"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Min" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {minutes.map((m) => (
                                <SelectItem key={m} value={m}>
                                  {m}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* End Time */}
                <div className="space-y-3">
                  <FormLabel>End Time</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="endHour"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Hour" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {hours.map((h) => (
                                <SelectItem key={h} value={h}>
                                  {h}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endMinute"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Min" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {minutes.map((m) => (
                                <SelectItem key={m} value={m}>
                                  {m}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Plus className="h-4 w-4" />
                {isSubmitting ? "Adding..." : "Add Slot"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Slot List */}
      <Card className="shadow-md border-muted/40">
        <CardHeader>
          <CardTitle>Your Availability</CardTitle>
          <CardDescription>
            Students can book from these available times.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-14 w-14 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">No availability slots yet</p>
              <p className="text-sm">
                Add your first slot above to start receiving bookings.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border hover:shadow-sm transition"
                >
                  <div>
                    <p className="font-medium text-sm md:text-base">
                      {formatSlotTime(slot.startTime, slot.endTime)}
                    </p>
                    <div className="mt-1">
                      {slot.isBooked ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                          Booked
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                          Available
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(slot.id)}
                    disabled={slot.isBooked}
                    className="self-end sm:self-auto"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAvailabilitySlot;
