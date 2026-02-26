"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProfile } from "@/lib/api/profile";
import { authClient } from "@/lib/auth";
import type {
  AdminProfile,
  StudentProfile,
  TutorProfile,
} from "@/types/profile";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import ManageAvailability from "./ManageAvailability";
import ProfileInfoForm from "./ProfileInfoForm";

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const [profile, setProfile] = useState<
    StudentProfile | TutorProfile | AdminProfile | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [session]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-4xl mx-auto mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!profile) return null;

  const isTutor = profile.role === "TUTOR";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          {isTutor && (
            <TabsTrigger value="availability">Availability</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile">
          <ProfileInfoForm profile={profile} onUpdate={setProfile} />
        </TabsContent>

        {isTutor && (
          <TabsContent value="availability">
            <ManageAvailability
              tutorId={profile.id}
              initialSlots={(profile as TutorProfile).availability}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
