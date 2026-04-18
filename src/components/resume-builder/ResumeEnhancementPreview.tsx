"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResumeEnhanceData } from "@/services/resumeBuilderApi";

type ResumeEnhancementPreviewProps = {
  result: ResumeEnhanceData;
  isApplying?: boolean;
  onApplyToProfile?: () => Promise<unknown> | unknown;
};

export function ResumeEnhancementPreview({
  result,
  isApplying,
  onApplyToProfile,
}: ResumeEnhancementPreviewProps) {
  const showApplyButton = !result.appliedToProfile && Boolean(onApplyToProfile);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {result.enhancement.headline || "Enhanced Profile"}
        </CardTitle>
        <CardDescription>
          Generated for {result.tutorName} on{" "}
          {new Date(result.generatedAt).toLocaleString()}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="py-4">
            <CardHeader>
              <CardTitle className="text-base">Original Bio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {result.originalBio || "No original bio found."}
              </p>
            </CardContent>
          </Card>

          <Card className="py-4 border-primary/40">
            <CardHeader>
              <CardTitle className="text-base">Improved Bio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-line">
                {result.enhancement.improvedBio || "No improved bio returned."}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="py-4">
            <CardHeader>
              <CardTitle className="text-base">Expertise Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {result.enhancement.expertiseHighlights.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="py-4">
            <CardHeader>
              <CardTitle className="text-base">Teaching Strengths</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {result.enhancement.teachingStrengths.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Suggested Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {result.enhancement.suggestedKeywords.map((keyword, index) => (
              <Badge key={`${keyword}-${index}`} variant="outline">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        <Card className="py-4 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">Profile Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {result.enhancement.profileSummary}
            </p>
          </CardContent>
        </Card>

        {showApplyButton && (
          <Button
            disabled={isApplying}
            onClick={() => void onApplyToProfile?.()}
          >
            {isApplying ? "Applying..." : "Apply This Bio to Profile"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
