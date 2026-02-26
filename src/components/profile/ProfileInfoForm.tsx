"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/lib/api/profile";
import type {
  AdminProfile,
  StudentProfile,
  TutorProfile,
} from "@/types/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Schema for student
const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

// Schema for tutor
const tutorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  headline: z.string().optional(),
  pricePerHr: z.number().min(5, "Minimum $5").max(500),
  experience: z.number().min(0),
  // categories handled separately (multi-select)
});

// Schema for admin (same as student)
const adminSchema = studentSchema;

type ProfileFormValues = z.infer<typeof tutorSchema>; // union would be complex; we'll use any

interface ProfileInfoFormProps {
  profile: StudentProfile | TutorProfile | AdminProfile;
  onUpdate: (updated: any) => void;
}

export default function ProfileInfoForm({
  profile,
  onUpdate,
}: ProfileInfoFormProps) {
  const isTutor = profile.role === "TUTOR";
  const isAdmin = profile.role === "ADMIN";

  // Build default values based on role
  const defaultValues = isTutor
    ? {
        name: (profile as TutorProfile).name,
        email: (profile as TutorProfile).email,
        bio: (profile as TutorProfile).bio,
        headline: (profile as TutorProfile).headline || "",
        pricePerHr: (profile as TutorProfile).pricePerHr,
        experience: (profile as TutorProfile).experience,
        // categories handled separately
      }
    : {
        name: profile.name,
        email: profile.email,
      };

  const form = useForm({
    resolver: zodResolver(isTutor ? tutorSchema : studentSchema),
    defaultValues,
  });

  const [categoryIds, setCategoryIds] = useState<string[]>(
    isTutor ? (profile as TutorProfile).categories.map((c) => c.id) : [],
  );

  const [allCategories, setAllCategories] = useState<
    { id: string; name: string }[]
  >([]);

  // Load categories for tutor
  useEffect(() => {
    if (isTutor) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`)
        .then((res) => res.json())
        .then((data) => setAllCategories(data.data || []));
    }
  }, [isTutor]);

  const onSubmit = async (values: any) => {
    try {
      const payload = isTutor ? { ...values, categoryIds } : values;
      const updated = await updateProfile(payload);
      toast.success("Profile updated successfully");
      onUpdate(updated);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} disabled={isAdmin} />
                  </FormControl>
                  {isAdmin && (
                    <FormDescription>
                      Admins cannot change email
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {isTutor && (
              <>
                <FormField
                  control={form.control}
                  name="headline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Headline</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Experienced Math Tutor"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pricePerHr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hourly Rate ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Categories (multi-select) */}
                <FormItem>
                  <FormLabel>Subjects</FormLabel>
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                    {allCategories.map((cat) => (
                      <div key={cat.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={cat.id}
                          checked={categoryIds.includes(cat.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCategoryIds([...categoryIds, cat.id]);
                            } else {
                              setCategoryIds(
                                categoryIds.filter((id) => id !== cat.id),
                              );
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={cat.id} className="text-sm">
                          {cat.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormItem>
              </>
            )}

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
