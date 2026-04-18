import { create } from "zustand";

type TutorProfileCacheEntry = {
  headline?: string;
  bio?: string;
  updatedAt: string;
};

type TutorProfileCacheState = {
  byTutorId: Record<string, TutorProfileCacheEntry>;
  setEnhancedProfile: (
    tutorId: string,
    headline?: string,
    bio?: string,
  ) => void;
};

export const useTutorProfileCacheStore = create<TutorProfileCacheState>(
  (set) => ({
    byTutorId: {},
    setEnhancedProfile: (tutorId, headline, bio) => {
      if (!tutorId) return;

      set((state) => ({
        byTutorId: {
          ...state.byTutorId,
          [tutorId]: {
            headline,
            bio,
            updatedAt: new Date().toISOString(),
          },
        },
      }));
    },
  }),
);
