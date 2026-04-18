"use client";

import {
  EnhanceResumePayload,
  ResumeBuilderApiError,
  ResumeBuilderErrorCode,
  ResumeEnhanceData,
  resumeBuilderApi,
} from "@/services/resumeBuilderApi";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { useTutorProfileCacheStore } from "@/store/useTutorProfileCacheStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const getFriendlyMessage = (code: ResumeBuilderErrorCode, fallback: string) => {
  if (code === "UNAUTHORIZED") {
    return "Your session has expired. Please log in again as tutor.";
  }

  if (code === "PROFILE_MISSING") {
    return "Create your tutor profile first before using Resume Builder.";
  }

  if (code === "SERVER_ERROR") {
    return "The server is busy right now. Please try again in a moment.";
  }

  return fallback;
};

export function useResumeBuilder() {
  const user = useAuthStore((state) => state.user);
  const [lastResult, setLastResult] = useState<ResumeEnhanceData | null>(null);
  const [lastPayload, setLastPayload] = useState<EnhanceResumePayload | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<ResumeBuilderErrorCode | null>(
    null,
  );

  const setEnhancedProfile = useTutorProfileCacheStore(
    (state) => state.setEnhancedProfile,
  );

  const storageKey = useMemo(
    () => `resume-builder:last-result:${user?.id || "anonymous"}`,
    [user?.id],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ResumeEnhanceData;
      if (parsed?.tutorId) {
        setLastResult(parsed);
      }
    } catch {
      // Ignore invalid cached data.
    }
  }, [storageKey]);

  const generate = useCallback(
    async (payload: EnhanceResumePayload) => {
      setIsGenerating(true);
      setError(null);
      setErrorCode(null);

      try {
        const result = await resumeBuilderApi.enhanceResume(payload);
        setLastResult(result);
        setLastPayload(payload);

        if (typeof window !== "undefined") {
          localStorage.setItem(storageKey, JSON.stringify(result));
        }

        if (result.appliedToProfile) {
          setEnhancedProfile(
            result.tutorId,
            result.enhancement.headline,
            result.enhancement.improvedBio,
          );
          toast.success("Enhanced bio applied to your profile");
        } else {
          toast.success("Enhanced profile generated successfully");
        }

        return result;
      } catch (error) {
        const apiError =
          error instanceof ResumeBuilderApiError
            ? error
            : new ResumeBuilderApiError(
                error instanceof Error
                  ? error.message
                  : "Failed to enhance tutor profile",
                0,
                "UNKNOWN",
              );

        const friendlyMessage = getFriendlyMessage(
          apiError.code,
          apiError.message,
        );
        setError(friendlyMessage);
        setErrorCode(apiError.code);
        toast.error(friendlyMessage);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [setEnhancedProfile, storageKey],
  );

  const applyLastResult = useCallback(async () => {
    if (!lastPayload) {
      setError("Generate a profile first before applying it.");
      return null;
    }

    setIsApplying(true);
    setError(null);
    setErrorCode(null);

    const applyPayload: EnhanceResumePayload = {
      ...lastPayload,
      applyToProfile: true,
    };

    try {
      const result = await resumeBuilderApi.enhanceResume(applyPayload);
      setLastResult(result);
      setLastPayload(applyPayload);

      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(result));
      }

      setEnhancedProfile(
        result.tutorId,
        result.enhancement.headline,
        result.enhancement.improvedBio,
      );

      toast.success("Enhanced bio applied to your profile");
      return result;
    } catch (error) {
      const apiError =
        error instanceof ResumeBuilderApiError
          ? error
          : new ResumeBuilderApiError(
              error instanceof Error
                ? error.message
                : "Failed to apply enhanced profile",
              0,
              "UNKNOWN",
            );

      const friendlyMessage = getFriendlyMessage(
        apiError.code,
        apiError.message,
      );
      setError(friendlyMessage);
      setErrorCode(apiError.code);
      toast.error(friendlyMessage);
      return null;
    } finally {
      setIsApplying(false);
    }
  }, [lastPayload, setEnhancedProfile, storageKey]);

  const retryLastGeneration = useCallback(async () => {
    if (!lastPayload) {
      setError("Fill in resume details and generate first.");
      return null;
    }

    return generate(lastPayload);
  }, [generate, lastPayload]);

  return {
    lastResult,
    lastPayload,
    isGenerating,
    isApplying,
    error,
    errorCode,
    generate,
    applyLastResult,
    retryLastGeneration,
  };
}
