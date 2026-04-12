"use client";

import { apiJson } from "@/lib/api-client";

export interface SmartMatchRequest {
  goal: string;
  limit?: number;
}

export interface TutorUserData {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface TutorCategoryData {
  id?: string;
  name?: string;
  title?: string;
}

export interface TutorReviewData {
  id?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
  student?: {
    name?: string;
  };
}

export interface TutorData {
  id: string;
  userId: string;
  bio: string;
  user: TutorUserData;
  categories: TutorCategoryData[];
  reviews: TutorReviewData[];
  experience: number;
  pricePerHr: number;
  rating: number;
  isVerified: boolean;
  isFeatured: boolean;
}

export interface MatchedTutor {
  tutorId: string;
  matchScore: number;
  reason: string;
  keywords?: string[];
  matchRationale?: string;
  profileUrl?: string;
  tutor: TutorData | null;
}

export interface SmartMatchResponseData {
  studentGoal: string;
  timestamp: string;
  recommendations: MatchedTutor[];
  alternativeRecommendations?: string;
  totalTutorsAnalyzed: number;
  responseTime?: number;
  aiProvider?: string;
}

export interface DetailedCategoryMatch {
  category: string;
  topTutors: TutorData[];
}

export interface DetailedSmartMatchResponseData extends SmartMatchResponseData {
  byCategory?: DetailedCategoryMatch[];
}

export interface SmartMatchResponse {
  success: boolean;
  data: SmartMatchResponseData | DetailedSmartMatchResponseData;
  warning?: string;
  metadata?: {
    aiProvider?: string;
    responseTimeMs?: number;
    cached?: boolean;
  };
}

class SmartMatchService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  async findMatches(goal: string): Promise<SmartMatchResponse> {
    const path = "/smart-match";

    try {
      const response = await apiJson<SmartMatchResponse>(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
        skipAuthRedirect: true, // Don't redirect for public endpoint
      });

      return response as SmartMatchResponse;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to find matches";
      throw new Error(errorMessage);
    }
  }

  async getDetailedMatches(
    goal: string,
    limit?: number,
  ): Promise<SmartMatchResponse> {
    const path = "/smart-match/detailed";

    try {
      const response = await apiJson<SmartMatchResponse>(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, limit }),
        skipAuthRedirect: true, // Don't redirect for public endpoint
      });

      return response as SmartMatchResponse;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get matches";
      throw new Error(errorMessage);
    }
  }
}

export const smartMatchService = new SmartMatchService();
