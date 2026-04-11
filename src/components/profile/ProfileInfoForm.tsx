"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/lib/api/profile";
import type {
  AdminProfile,
  StudentProfile,
  TutorProfile,
} from "@/types/profile";

// Combined Schema to handle all roles dynamically
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  // Tutor specific fields (optional in schema, but validated if present)
  bio: z.string().min(10, "Bio must be at least 10 characters").optional(),
  pricePerHr: z.number().min(5, "Minimum $5").max(500).optional(),
  experience: z.number().min(0, "Cannot be negative").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileInfoFormProps {
  profile: StudentProfile | TutorProfile | AdminProfile;
  onUpdate: (updated: StudentProfile | TutorProfile | AdminProfile) => void;
}

export default function ProfileInfoForm({
  profile,
  onUpdate,
}: ProfileInfoFormProps) {
  const isTutor = profile.role === "TUTOR";
  const isAdmin = profile.role === "ADMIN";

  const [allCategories, setAllCategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [stripeConnectLoading, setStripeConnectLoading] = useState(false);
  const [stripeAccountId, setStripeAccountId] = useState(
    isTutor ? (profile as TutorProfile).stripeConnectedAccountId || "" : "",
  );
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    isTutor ? (profile as TutorProfile).categories?.map((c) => c.id) || [] : [],
  );
  console.log(profile);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name || "",
      email: profile.email || "",
      bio: isTutor ? (profile as TutorProfile).bio || "" : "",
      pricePerHr: isTutor ? (profile as TutorProfile).pricePerHr || 0 : 0,
      experience: isTutor ? (profile as TutorProfile).experience || 0 : 0,
    },
  });

  useEffect(() => {
    if (isTutor) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`)
        .then((res) => res.json())
        .then((data) => setAllCategories(data.data || []))
        .catch(() => toast.error("Failed to load categories"));
    }
  }, [isTutor]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      // Prepare payload: only include tutor fields if role is TUTOR
      const payload = isTutor
        ? {
            ...values,
            categoryIds: selectedCategoryIds,
            stripeConnectedAccountId: stripeAccountId || undefined,
          }
        : { name: values.name, email: values.email };

      const updated = await updateProfile(payload);
      toast.success("Profile updated successfully");
      onUpdate(updated as StudentProfile | TutorProfile | AdminProfile);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Update failed";
      toast.error(message);
    }
  };

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleConnectStripe = async () => {
    setStripeConnectLoading(true);

    const endpoints = [
      `${process.env.NEXT_PUBLIC_BASE_URL}/tutor-profiles/stripe/connect-link`,
      `${process.env.NEXT_PUBLIC_BASE_URL}/tutor-profiles/connect-stripe`,
      `${process.env.NEXT_PUBLIC_BASE_URL}/payments/stripe/connect-link`,
    ];

    try {
      for (const endpoint of endpoints) {
        const response = await fetch(endpoint, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          continue;
        }

        const result = await response.json().catch(() => ({}));
        const connectUrl =
          result?.url || result?.data?.url || result?.accountLink;

        if (connectUrl) {
          window.location.href = connectUrl;
          return;
        }
      }

      toast.error("Could not start Stripe onboarding. Please contact support.");
    } catch (error) {
      toast.error("Failed to start Stripe onboarding");
    } finally {
      setStripeConnectLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal details and public profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Name */}
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

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} disabled={isAdmin} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isTutor && (
              <div className="space-y-6 border-t pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Tutor Professional Details
                </h3>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Tell students about your teaching style..."
                          {...field}
                        />
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

                {/* Subjects Multi-select UI */}
                <div className="space-y-3">
                  <FormLabel>Subjects / Categories</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedCategoryIds.map((id) => {
                      const cat = allCategories.find((c) => c.id === id);
                      return cat ? (
                        <Badge key={id} variant="secondary" className="pl-2">
                          {cat.name}
                          <button
                            type="button"
                            onClick={() => toggleCategory(id)}
                            className="ml-2 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 border rounded-md bg-muted/20">
                    {allCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`flex items-center justify-between px-3 py-2 text-xs rounded-md border transition-colors ${
                          selectedCategoryIds.includes(cat.id)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background hover:bg-muted"
                        }`}
                      >
                        {cat.name}
                        {selectedCategoryIds.includes(cat.id) && (
                          <Check className="h-3 w-3" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">Stripe payout setup</p>
                    <p className="text-xs text-muted-foreground">
                      Connect Stripe so confirmed sessions can pay out to your
                      connected account.
                    </p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                    <div className="space-y-2">
                      <FormLabel>Connected Account ID (optional)</FormLabel>
                      <Input
                        value={stripeAccountId}
                        onChange={(e) => setStripeAccountId(e.target.value)}
                        placeholder="acct_..."
                      />
                      <p className="text-xs text-muted-foreground">
                        If your backend supports automatic onboarding links, use
                        the connect button below.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleConnectStripe}
                      disabled={stripeConnectLoading}
                      className="gap-2"
                    >
                      {stripeConnectLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ExternalLink className="h-4 w-4" />
                      )}
                      Connect Stripe
                    </Button>
                  </div>

                  <Badge variant="secondary" className="w-fit">
                    {(profile as TutorProfile).stripeOnboardingComplete
                      ? "Payouts enabled"
                      : "Payout setup required"}
                  </Badge>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full md:w-auto"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
