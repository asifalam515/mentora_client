"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateAvailability } from "@/lib/api/profile";
import type { AvailabilitySlot } from "@/types/profile";
import { Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AvailabilityManagerProps {
  tutorId: string;
  initialSlots: AvailabilitySlot[];
}

export default function ManageAvailability({
  tutorId,
  initialSlots,
}: AvailabilityManagerProps) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>(initialSlots);
  const [saving, setSaving] = useState(false);

  const addSlot = () => {
    const newSlot: AvailabilitySlot = {
      id: `temp-${Date.now()}`, // temporary id
      startTime: new Date().toISOString().slice(0, 16), // datetime-local expects "YYYY-MM-DDTHH:mm"
      endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
      isBooked: false,
    };
    setSlots([...slots, newSlot]);
  };

  const updateSlot = (
    index: number,
    field: keyof AvailabilitySlot,
    value: string,
  ) => {
    const updated = [...slots];
    updated[index] = { ...updated[index], [field]: value };
    setSlots(updated);
  };

  const deleteSlot = (index: number) => {
    const updated = slots.filter((_, i) => i !== index);
    setSlots(updated);
  };

  const handleSave = async () => {
    // Convert datetime-local strings to ISO strings
    const payload = slots.map((slot) => ({
      id: slot.id.startsWith("temp-") ? undefined : slot.id,
      startTime: new Date(slot.startTime).toISOString(),
      endTime: new Date(slot.endTime).toISOString(),
    }));

    try {
      setSaving(true);
      await updateAvailability(payload);
      toast.success("Availability updated successfully");
      // Optionally refresh data
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Availability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {slots.map((slot, index) => (
            <div
              key={slot.id}
              className="flex items-center gap-3 border rounded-lg p-3"
            >
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Start</Label>
                  <Input
                    type="datetime-local"
                    value={slot.startTime.slice(0, 16)}
                    onChange={(e) =>
                      updateSlot(index, "startTime", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">End</Label>
                  <Input
                    type="datetime-local"
                    value={slot.endTime.slice(0, 16)}
                    onChange={(e) =>
                      updateSlot(index, "endTime", e.target.value)
                    }
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteSlot(index)}
                disabled={slot.isBooked}
                title={slot.isBooked ? "Cannot delete booked slot" : ""}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={addSlot} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Time Slot
        </Button>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
