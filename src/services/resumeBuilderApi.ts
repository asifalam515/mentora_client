"use client";

import { ApiError, apiJson } from "@/lib/api-client";

export type ResumeTone = "professional" | "friendly" | "premium";
export type ResumeBuilderErrorCode =
  | "UNAUTHORIZED"
  | "PROFILE_MISSING"
  | "SERVER_ERROR"
  | "UNKNOWN";

export interface EnhanceResumePayload {
  tone: ResumeTone;
  achievements: string[];
  teachingStyle: string;
  specialties: string[];
  applyToProfile: boolean;
}

export interface ResumeEnhancement {
  headline: string;
  improvedBio: string;
  expertiseHighlights: string[];
  teachingStrengths: string[];
  suggestedKeywords: string[];
  profileSummary: string;
}

export interface ResumeEnhanceData {
  tutorId: string;
  tutorName: string;
  originalBio: string;
  enhancement: ResumeEnhancement;
  appliedToProfile: boolean;
  generatedAt: string;
}

export interface ResumeEnhanceResponse {
  success: boolean;
  message: string;
  data: ResumeEnhanceData;
}

export class ResumeBuilderApiError extends Error {
  status: number;
  code: ResumeBuilderErrorCode;

  constructor(message: string, status: number, code: ResumeBuilderErrorCode) {
    super(message);
    this.name = "ResumeBuilderApiError";
    this.status = status;
    this.code = code;
  }
}

const mapErrorCode = (status: number): ResumeBuilderErrorCode => {
  if (status === 401) return "UNAUTHORIZED";
  if (status === 404) return "PROFILE_MISSING";
  if (status >= 500) return "SERVER_ERROR";
  return "UNKNOWN";
};

class ResumeBuilderApi {
  async enhanceResume(
    payload: EnhanceResumePayload,
  ): Promise<ResumeEnhanceData> {
    try {
      const response = await apiJson<ResumeEnhanceResponse>(
        "/resume-builder/enhance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response?.success || !response?.data) {
        throw new ResumeBuilderApiError(
          "Invalid response while enhancing tutor profile",
          500,
          "SERVER_ERROR",
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof ResumeBuilderApiError) throw error;

      if (error instanceof ApiError) {
        throw new ResumeBuilderApiError(
          error.message,
          error.status,
          mapErrorCode(error.status),
        );
      }

      const message =
        error instanceof Error
          ? error.message
          : "Failed to enhance tutor profile";
      throw new ResumeBuilderApiError(message, 0, "UNKNOWN");
    }
  }
}

export const resumeBuilderApi = new ResumeBuilderApi();
