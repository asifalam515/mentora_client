export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatarUrl: string | null;
  rating: number;
  quote: string;
  verified: boolean;
}

export interface Metric {
  id: string;
  label: string;
  value: string;
  icon: string;
}

export interface WhyChoosingUsApiResponse {
  testimonials: Testimonial[];
  metrics: Metric[];
}

export interface WhyChoosingUsStrings {
  eyebrow: string;
  heading: string;
  intro: string;
  ctaLabel: string;
  ctaDescription: string;
  testimonialsLabel: string;
  metricsLabel: string;
  previousLabel: string;
  nextLabel: string;
  pauseLabel: string;
  playLabel: string;
  readMoreLabel: string;
  showLessLabel: string;
  verifiedLabel: string;
  placeholderTitle: string;
  placeholderBody: string;
  liveRegionLabel: (current: number, total: number) => string;
}

export interface WhyChoosingUsProps {
  testimonials?: Testimonial[];
  metrics?: Metric[];
  variant?: "compact" | "expanded";
  autoRotate?: boolean;
  onCtaClick?: () => void;
  strings?: Partial<WhyChoosingUsStrings>;
}
