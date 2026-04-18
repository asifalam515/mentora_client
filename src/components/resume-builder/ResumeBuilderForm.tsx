"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EnhanceResumePayload, ResumeTone } from "@/services/resumeBuilderApi";
import { FormEvent, useMemo, useState } from "react";
import { KeywordChipsInput } from "./KeywordChipsInput";

type ResumeBuilderFormProps = {
  loading?: boolean;
  onSubmit: (payload: EnhanceResumePayload) => Promise<unknown> | unknown;
};

type FormErrors = {
  content?: string;
};

const TONES: ResumeTone[] = ["professional", "friendly", "premium"];

const formatTone = (tone: ResumeTone) =>
  tone.charAt(0).toUpperCase() + tone.slice(1);

export function ResumeBuilderForm({
  loading,
  onSubmit,
}: ResumeBuilderFormProps) {
  const [tone, setTone] = useState<ResumeTone>("professional");
  const [achievements, setAchievements] = useState<string[]>([]);
  const [teachingStyle, setTeachingStyle] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [applyToProfile, setApplyToProfile] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const hasAnyContent = useMemo(() => {
    return (
      achievements.length > 0 ||
      specialties.length > 0 ||
      teachingStyle.trim().length > 0
    );
  }, [achievements.length, specialties.length, teachingStyle]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!hasAnyContent) {
      setErrors({
        content:
          "Provide at least one achievement, specialty, or teaching style.",
      });
      return;
    }

    setErrors({});

    await onSubmit({
      tone,
      achievements,
      teachingStyle: teachingStyle.trim(),
      specialties,
      applyToProfile,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tutor Resume Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select
              value={tone}
              onValueChange={(value) => setTone(value as ResumeTone)}
              disabled={loading}
            >
              <SelectTrigger className="w-full md:w-70">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {formatTone(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <KeywordChipsInput
            label="Achievements"
            value={achievements}
            disabled={loading}
            placeholder="Add achievement and press Enter"
            onChange={setAchievements}
          />

          <div className="space-y-2">
            <Label htmlFor="teachingStyle">Teaching Style</Label>
            <Textarea
              id="teachingStyle"
              value={teachingStyle}
              disabled={loading}
              placeholder="Hands-on and project-based with weekly feedback"
              onChange={(event) => setTeachingStyle(event.target.value)}
            />
          </div>

          <KeywordChipsInput
            label="Specialties"
            value={specialties}
            disabled={loading}
            placeholder="Add specialty and press Enter"
            onChange={setSpecialties}
          />

          <div className="flex items-center gap-2">
            <input
              id="applyToProfile"
              type="checkbox"
              checked={applyToProfile}
              disabled={loading}
              onChange={(event) => setApplyToProfile(event.target.checked)}
            />
            <Label htmlFor="applyToProfile">Apply directly to profile</Label>
          </div>

          {errors.content && (
            <p className="text-sm text-red-600">{errors.content}</p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate Enhanced Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
