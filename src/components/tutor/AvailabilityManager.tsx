"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, isBefore, parseISO } from "date-fns";
import {
  CalendarIcon,
  Clock,
  Edit2,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  createSlot,
  deleteSlot,
  getSlot,
  updateSlot,
} from "@/services/slot/slot";
import { toast } from "sonner";

// --- Schema & Types ---
const availabilitySlotSchema = z
  .object({
    date: z.date(),
    startHour: z.string().min(1, "Required"),
    startMinute: z.string().min(1, "Required"),
    endHour: z.string().min(1, "Required"),
    endMinute: z.string().min(1, "Required"),
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
    {
      message: "End time must be after start time",
      path: ["endHour"],
    },
  );

type AvailabilitySlotForm = z.infer<typeof availabilitySlotSchema>;

interface AvailabilitySlot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

const AvailabilityManager = ({ tutorId }: { tutorId: string }) => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);

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

  const fetchSlots = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getSlot();
      setSlots(data || []);
    } catch (error) {
      toast.error("Failed to fetch slots");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // --- Handlers ---
  const processDateTime = (data: AvailabilitySlotForm) => {
    const start = new Date(data.date);
    start.setHours(parseInt(data.startHour), parseInt(data.startMinute), 0, 0);
    const end = new Date(data.date);
    end.setHours(parseInt(data.endHour), parseInt(data.endMinute), 0, 0);
    return { startTime: start.toISOString(), endTime: end.toISOString() };
  };

  const onSubmit = async (data: AvailabilitySlotForm) => {
    setIsSubmitting(true);
    try {
      if (editingSlotId) {
        // Update Mode
        await updateSlot(editingSlotId, processDateTime(data));
        toast.success("Slot updated successfully");
        setIsEditDialogOpen(false);
        setEditingSlotId(null);
      } else {
        // Create Mode
        await createSlot({ ...processDateTime(data), isBooked: false });
        toast.success("Slot created successfully");
      }
      form.reset();
      fetchSlots();
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (slot: AvailabilitySlot) => {
    const start = parseISO(slot.startTime);
    const end = parseISO(slot.endTime);

    setEditingSlotId(slot.id);
    form.reset({
      date: start,
      startHour: format(start, "HH"),
      startMinute: format(start, "mm"),
      endHour: format(end, "HH"),
      endMinute: format(end, "mm"),
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (slotId: string) => {
    const toastId = toast.loading("Deleting...");
    try {
      await deleteSlot(slotId);
      toast.success("Slot deleted", { id: toastId });
      fetchSlots();
    } catch (error) {
      toast.error("Could not delete", { id: toastId });
    }
  };

  // --- Shared Form Fields UI ---
  const FormFields = () => (
    <>
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
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <FormLabel>Start Time</FormLabel>
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="startHour"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
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
              )}
            />
            <FormField
              control={form.control}
              name="startMinute"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
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
              )}
            />
          </div>
        </div>
        <div className="space-y-2">
          <FormLabel>End Time</FormLabel>
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="endHour"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
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
              )}
            />
            <FormField
              control={form.control}
              name="endMinute"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
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
              )}
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4">
      {/* Create Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Add Availability
          </CardTitle>
          <CardDescription>Set your teaching hours.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormFields />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Add Slot
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* List Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Existing Slots</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <div className="grid gap-3">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-accent/5 transition"
                >
                  <div>
                    <p className="font-medium">
                      {format(parseISO(slot.startTime), "MMM d, yyyy")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(slot.startTime), "h:mm a")} -{" "}
                      {format(parseISO(slot.endTime), "h:mm a")}
                    </p>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${slot.isBooked ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"}`}
                    >
                      {slot.isBooked ? "Booked" : "Available"}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(slot)}
                      disabled={slot.isBooked}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(slot.id)}
                      disabled={slot.isBooked}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) setEditingSlotId(null);
          setIsEditDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Availability</DialogTitle>
            <DialogDescription>
              Update the time for this specific slot.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormFields />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Updating..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvailabilityManager;
