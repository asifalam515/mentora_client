"use client";

import ProfilePage from "@/components/profile/ProfilePage";
import { useAuthStore } from "@/store/useAuthStore.ts";

const Profile = () => {
  const user = useAuthStore((state) => state.user); // get current logged-in user
  const isLoading = useAuthStore((state) => state.isLoading); // optional loading state

  if (isLoading) {
    return <p>Loading...</p>; // or a skeleton UI
  }

  if (!user) {
    return <p>User not logged in</p>;
  }

  return (
    <div>
      <ProfilePage />
    </div>
  );
};

export default Profile;
