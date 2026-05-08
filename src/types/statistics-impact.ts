export interface AnalyticsShape {
  activeTutors: number;
  sessionsBooked: number;
  avgRating: number;
  totalReviews: number;
}

export interface AnalyticsApiResponse {
  analytics: AnalyticsShape;
}

export interface StatisticsImpactStrings {
  eyebrow: string;
  heading: string;
  subhead: string;
  loadingLabel: string;
  errorTitle: string;
  errorBody: string;
  emptyTitle: string;
  emptyBody: string;
  retryLabel: string;
  adminSeedLabel: string;
  activeTutorsLabel: string;
  sessionsBookedLabel: string;
  avgRatingLabel: string;
  totalReviewsLabel: string;
}

export interface StatisticsImpactProps {
  variant?: "compact" | "featured";
  showIcons?: boolean;
  onRetry?: () => void;
  fallback?: AnalyticsShape;
  autoRefreshIntervalMs?: number | null;
  strings?: Partial<StatisticsImpactStrings>;
}
