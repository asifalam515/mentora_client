"use client";

import { ResumeBuilderForm } from "@/components/resume-builder/ResumeBuilderForm";
import { ResumeEnhancementPreview } from "@/components/resume-builder/ResumeEnhancementPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { AlertCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ResumeBuilderPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const {
    lastResult,
    isGenerating,
    isApplying,
    error,
    errorCode,
    generate,
    applyLastResult,
    retryLastGeneration,
  } = useResumeBuilder();

  useEffect(() => {
    if (errorCode === "UNAUTHORIZED") {
      router.push("/login?redirect=/dashboard?view=resume-builder");
    }
  }, [errorCode, router]);

  if (user?.role !== "TUTOR") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tutor Resume Builder</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This feature is available for tutors only.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Resume Builder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Generate an enhanced professional profile with AI and optionally
            apply it directly to your tutor bio.
          </p>
        </CardContent>
      </Card>

      {errorCode === "PROFILE_MISSING" && (
        <Card className="border-amber-300 bg-amber-50/40">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2 text-amber-700">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              <p className="text-sm">
                Create your tutor profile first, then return to Resume Builder.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <ResumeBuilderForm loading={isGenerating} onSubmit={generate} />

      {isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle>Generating your enhanced tutor profile...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-28 w-full" />
            <div className="grid gap-3 md:grid-cols-2">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <Skeleton className="h-28 w-full" />
          </CardContent>
        </Card>
      )}

      {!isGenerating && lastResult && (
        <ResumeEnhancementPreview
          result={lastResult}
          isApplying={isApplying}
          onApplyToProfile={
            lastResult.appliedToProfile ? undefined : applyLastResult
          }
        />
      )}

      {error && errorCode !== "PROFILE_MISSING" && (
        <Card className="border-red-300">
          <CardContent className="pt-6 space-y-3">
            <p className="text-sm text-red-600">{error}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => void retryLastGeneration()}
              disabled={isGenerating || isApplying}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
